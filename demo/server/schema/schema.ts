// eslint-disable-next-line import/no-import-module-exports
import db from '../models/db.js';

import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
} from 'graphql';

// =========================== //
// ===== TYPE DEFINITIONS ==== //
// =========================== //

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: { type: GraphQLString },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    country: { type: GraphQLString },
  }),
});

// ================== //
// ===== QUERIES ==== //
// ================== //

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    //GET BOOK BY ID
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        const queryString = `
        SELECT books.*, genres.name AS genre, authors.name AS author
        FROM ((books
        INNER JOIN  booksAuthors ON books.id = booksAuthors.BookId)
        INNER JOIN authors ON booksAuthors.AuthorId = authors.id)
        INNER JOIN genres ON books.genre_id = genres.id
        WHERE books.id = $1
        `;
        const book = await db.query(queryString, [args.id]);
        return book.rows[0];
      },
    },
    //GET ALL BOOKS
    books: {
      type: new GraphQLList(BookType),
      async resolve(parent, args) {
        const queryString = `
        SELECT books.*, genres.name AS genre, authors.name AS author
        FROM ((books
        INNER JOIN  booksAuthors ON books.id = booksAuthors.BookId)
        INNER JOIN authors ON booksAuthors.AuthorId = authors.id)
        INNER JOIN genres ON books.genre_id = genres.id
        `;
        const books = await db.query(queryString);
        return books.rows;
      },
    },
    //GET AUTHOR BY ID
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        const queryString = `
        SELECT *
        FROM authors
        WHERE authors.id = $1
        `;
        const author = await db.query(queryString, [args.id]);
        return author.rows[0];
      },
    },
    //GET ALL AUTHORS
    authors: {
      type: new GraphQLList(AuthorType),
      async resolve(parent, args) {
        const queryString = `SELECT * FROM authors`;
        const authors = await db.query(queryString);
        return authors.rows;
      },
    },
    //GET ALL BOOKS BY AUTHOR
    booksByAuthor: {
      type: new GraphQLList(BookType),
      args: { name: { type: GraphQLString } },
      async resolve(parent, args) {
        const queryString = `
        SELECT books.*, genres.name AS genre, authors.name AS author
        FROM ((books
        INNER JOIN  booksAuthors ON books.id = booksAuthors.BookId)
        INNER JOIN authors ON booksAuthors.AuthorId = authors.id)
        INNER JOIN genres ON books.genre_id = genres.id
        WHERE authors.name = $1
        `;
        const books = await db.query(queryString, [args.name]);
        return books.rows;
      },
    },
    //GET ALL BOOKS BY GENRE
    booksByGenre: {
      type: new GraphQLList(BookType),
      args: { genre: { type: GraphQLString } },
      async resolve(parent, args) {
        const queryString = `
        SELECT books.*, genres.name AS genre, authors.name AS author
        FROM ((books
        INNER JOIN  booksAuthors ON books.id = booksAuthors.BookId)
        INNER JOIN authors ON booksAuthors.AuthorId = authors.id)
        INNER JOIN genres ON books.genre_id = genres.id
        WHERE genres.name = $1
        `;
        const books = await db.query(queryString, [args.genre]);
        return books.rows;
      },
    },
  },
});

// ================== //
// ===== MUTATIONS ==== //
// ================== //

const RootMutation = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    //ADD BOOK
    addBook: {
      type: BookType,
      args: {
        title: { type: GraphQLString },
        author: { type: GraphQLString },
        genre: { type: GraphQLString },
      },
      async resolve(parent, args) {
        const author = await db.query(
          `SELECT id FROM authors WHERE name = '${args.author}'`
        );
        const genre = await db.query(
          `SELECT id FROM genres WHERE genres.name = '${args.genre}'`
        );

        //const authorId: string = author.rows[0].id;
        //const genreId: string = genre.rows[0].id;
        const authorID = author.rows[0].id;
        const genreID = genre.rows[0].id;
        const queryString = `
        INSERT INTO books (title, genre_id)
        VALUES ($1, $2)
        RETURNING *`;
        const bookResponse = await db.query(queryString, [args.title, genreID]);
        const newBook = bookResponse.rows[0];
        newBook.author = args.author;
        newBook.genre = args.genre;
        const bookID = newBook.id;
        const joinTableQueryString = `
        INSERT INTO booksauthors (bookid, authorid)
        VALUES ($1, $2)
        `;
        await db.query(joinTableQueryString, [bookID, authorID]);
        return newBook;
      },
    },
    //UPDATE BOOK
    updateBook: {
      type: BookType,
      args: {
        id: { type: GraphQLID },
        author: { type: GraphQLString },
        genre: { type: GraphQLString },
      },
      async resolve(parent, args) {
        const updatedBook = await db.query('');
        return updatedBook.rows[0];
      },
    },
    //DELETE BOOK
    deleteBook: {
      type: BookType,
      args: {
        id: { type: GraphQLID },
        title: { type: GraphQLString },
      },
      async resolve(parent, args) {
        let queryString;
        if (args.title) {
          queryString = `
          DELETE FROM books 
          WHERE title = '${args.title}'
          RETURNING *`;
        }
        if (args.id) {
          queryString = `
          DELETE FROM books 
          WHERE id = ${args.title}
          RETURNING *
          `;
        }
        const deleted = await db.query(queryString);
        const bookID = deleted.rows[0].id;
        await db.query(`DELETE FROM booksauthors WHERE bookid = ${bookID}`);
        return deleted.rows[0];
      },
    },
    //ADD AUTHOR
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: GraphQLString },
        country: { type: GraphQLString },
      },
      async resolve(parent, args) {
        const queryString = `
        INSERT INTO authors (name, country)
        VALUES ($1, $2)
        RETURNING *
        `;
        const newAuthor = await db.query(queryString, [
          args.name,
          args.country,
        ]);
        return newAuthor.rows[0];
      },
    },
    //UPDATE AUTHOR
    updateAuthor: {
      type: AuthorType,
      args: {
        name: { type: GraphQLString },
        country: { type: GraphQLString },
      },
      async resolve(parent, args) {
        const updatedAuthor = await db.query('');
        return updatedAuthor.rows[0];
      },
    },
    //DELETE AUTHOR
    deleteAuthor: {
      type: AuthorType,
      args: {
        name: { type: GraphQLString },
      },
      async resolve(parent, args) {
        const queryString = `
        DELETE FROM authors
        WHERE name = '${args.name}
        RETURNING *
        `;
        const deletedAuthor = await db.query(queryString);
        return deletedAuthor.rows[0];
      },
    },
  },
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
  types: [BookType, AuthorType],
});
