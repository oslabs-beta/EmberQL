const db = require('../models/db.js');

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
        const queryString = `
        INSERT INTO books
        `;
        const newBook = db.query('');
        return newBook.rows[0];
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
        const deleted = await db.query('');
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
        const newAuthor = await db.query('');
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
        const deletedAuthor = await db.query('');
        return deletedAuthor.rows[0];
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
  types: [BookType, AuthorType],
});
