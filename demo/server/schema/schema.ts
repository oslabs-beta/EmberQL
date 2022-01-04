/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-use-before-define */
import db from '../models/db';

import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLString,
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
    genre: {
      type: GenreType,
      async resolve(parent) {
        const queryString = `
        SELECT * 
        FROM genres
        WHERE id = ${parent.genre_id}
        `;
        const genre = await db.query(queryString);
        return genre.rows[0] as string;
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      async resolve(parent) {
        const queryString = `
        SELECT authors.* 
        FROM ((authors
        INNER JOIN booksauthors ON booksAuthors.AuthorId = authors.id)
        INNER JOIN books ON books.id = booksAuthors.BookId)
        WHERE books.id = ${parent.id}
        `;
        const authors = await db.query(queryString);
        return authors.rows as string;
      },
    },
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

const GenreType = new GraphQLObjectType({
  name: 'Genre',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
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
        SELECT * FROM books
        WHERE id = $1
        `;
        const book = await db.query(queryString, [args.id]);
        return book.rows[0] as string;
      },
    },
    //GET ALL BOOKS
    books: {
      type: new GraphQLList(BookType),
      async resolve() {
        const queryString = `
        SELECT * FROM books
        `;
        const books = await db.query(queryString);
        return books.rows as string;
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
        return author.rows[0] as string;
      },
    },
    //GET ALL AUTHORS
    authors: {
      type: new GraphQLList(AuthorType),
      async resolve() {
        const queryString = 'SELECT * FROM authors';
        const authors = await db.query(queryString);
        return authors.rows as string;
      },
    },
    //GET ALL BOOKS BY AUTHOR
    booksByAuthor: {
      type: new GraphQLList(BookType),
      args: { name: { type: GraphQLString } },
      async resolve(parent, args) {
        const queryString = `
        SELECT books.*
        FROM ((books
        INNER JOIN  booksAuthors ON books.id = booksAuthors.BookId)
        INNER JOIN authors ON booksAuthors.AuthorId = authors.id)
        WHERE authors.name = $1
        `;
        const books = await db.query(queryString, [args.name]);
        return books.rows as string;
      },
    },
    //GET ALL GENRES
    genres: {
      type: new GraphQLList(GenreType),
      async resolve() {
        const queryString = 'SELECT * FROM genres';
        const genres = await db.query(queryString);
        return genres.rows as string;
      },
    },
    //GET ALL BOOKS BY GENRE
    booksByGenre: {
      type: new GraphQLList(BookType),
      args: { genre: { type: GraphQLString } },
      async resolve(parent, args) {
        const queryString = `
        SELECT books.*
        FROM books
        INNER JOIN genres ON books.genre_id = genres.id
        WHERE genres.name = $1
        `;
        const books = await db.query(queryString, [args.genre]);
        return books.rows as string;
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
        title: { type: new GraphQLNonNull(GraphQLString) },
        author: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: GraphQLString },
      },
      async resolve(parent, args) {
        const author = await db.query(
          `SELECT id FROM authors WHERE name = '${args.author}'`,
        );
        const genre = await db.query(
          `SELECT id FROM genres WHERE genres.name = '${args.genre}'`,
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
        return newBook as string;
      },
    },
    //UPDATE BOOK
    updateBook: {
      type: BookType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: GraphQLString },
        author: { type: GraphQLString },
        genre: { type: GraphQLString },
      },
      async resolve(parent, args) {
        if (args.author) {
          const authorQueryString = `
          UPDATE booksauthors
          SET booksauthors.authorID = authors.id
          FROM booksauthors 
          INNER JOIN authors ON booksauthors.authorID = authors.id
          WHERE booksauthors.bookID = ${args.id} AND authors.name = '${args.author}'
          `;
          await db.query(authorQueryString);
        }
        let bookQueryString = `
        SELECT * FROM books 
        WHERE books.id = ${args.id}
        `;
        const toUpdate = [];
        if (args.genre)
          toUpdate.push(
            `genre_id = (SELECT id FROM genres WHERE genres.name = '${args.genre}')`,
          );
        if (args.title) toUpdate.push(`title = '${args.title}'`);
        if (toUpdate.length > 0) {
          bookQueryString = `
          UPDATE books
          SET ${toUpdate.join()} 
          WHERE id = ${args.id}
          RETURNING *
          `;
        }
        const updatedBook = await db.query(bookQueryString);
        return updatedBook.rows[0] as string;
      },
    },
    //DELETE BOOK
    deleteBook: {
      type: BookType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(parent, args) {
        const queryString = `
          DELETE FROM books 
          WHERE id = ${args.id}
          RETURNING *
        `;
        await db.query(`DELETE FROM booksauthors WHERE bookid = ${args.id}`);
        const deleted = await db.query(queryString);
        return deleted.rows[0] as string;
      },
    },
    //ADD AUTHOR
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        country: { type: new GraphQLNonNull(GraphQLString) },
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
        return newAuthor.rows[0] as string;
      },
    },
    //UPDATE AUTHOR
    updateAuthor: {
      type: AuthorType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        country: { type: GraphQLString },
      },
      async resolve(parent, args) {
        const toUpdate = [];
        if (args.name) toUpdate.push(`name='${args.name}'`);
        if (args.country) toUpdate.push(`country='${args.country}'`);
        const queryString = `
        UPDATE authors
        SET ${toUpdate.join()}
        WHERE authors.id = ${args.id}
        RETURNING *
        `;
        const updatedAuthor = await db.query(queryString);
        return updatedAuthor.rows[0] as string;
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
        WHERE name = '${args.name}'
        RETURNING *
        `;
        const deletedAuthor = await db.query(queryString);
        return deletedAuthor.rows[0] as string;
      },
    },
    //ADD GENRE
    addGenre: {
      type: GenreType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args) {
        const queryString = `
        INSERT INTO genres (name)
        VALUES ($1)
        RETURNING *
        `;
        const newGenre = await db.query(queryString, [args.name]);
        return newGenre.rows[0] as string;
      },
    },
    //DELETE GENRE
    deleteGenre: {
      type: GenreType,
      args: {
        name: { type: GraphQLString },
      },
      async resolve(parent, args) {
        const queryString = `
        DELETE FROM genres
        WHERE name = '${args.name}'
        RETURNING *
        `;
        const deletedGenre = await db.query(queryString);
        return deletedGenre.rows[0] as string;
      },
    },
  },
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
  types: [BookType, AuthorType, GenreType],
});
