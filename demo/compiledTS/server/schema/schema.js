"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-use-before-define */
const db_js_1 = __importDefault(require("../models/db.js"));
const graphql_1 = require("graphql");
// =========================== //
// ===== TYPE DEFINITIONS ==== //
// =========================== //
const BookType = new graphql_1.GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: graphql_1.GraphQLID },
        title: { type: graphql_1.GraphQLString },
        genre: {
            type: GenreType,
            resolve(parent) {
                return __awaiter(this, void 0, void 0, function* () {
                    const queryString = `
        SELECT * 
        FROM genres
        WHERE id = ${parent.genre_id}
        `;
                    const genre = yield db_js_1.default.query(queryString);
                    return genre.rows[0];
                });
            },
        },
        authors: {
            type: new graphql_1.GraphQLList(AuthorType),
            resolve(parent) {
                return __awaiter(this, void 0, void 0, function* () {
                    const queryString = `
        SELECT authors.* 
        FROM ((authors
        INNER JOIN booksauthors ON booksAuthors.AuthorId = authors.id)
        INNER JOIN books ON books.id = booksAuthors.BookId)
        WHERE books.id = ${parent.id}
        `;
                    const authors = yield db_js_1.default.query(queryString);
                    return authors.rows;
                });
            },
        },
    }),
});
const AuthorType = new graphql_1.GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: graphql_1.GraphQLID },
        name: { type: graphql_1.GraphQLString },
        country: { type: graphql_1.GraphQLString },
    }),
});
const GenreType = new graphql_1.GraphQLObjectType({
    name: 'Genre',
    fields: () => ({
        id: { type: graphql_1.GraphQLID },
        name: { type: graphql_1.GraphQLString },
    }),
});
// ================== //
// ===== QUERIES ==== //
// ================== //
const RootQuery = new graphql_1.GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        //GET BOOK BY ID
        book: {
            type: BookType,
            args: { id: { type: graphql_1.GraphQLID } },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const queryString = `
        SELECT * FROM books
        WHERE id = $1
        `;
                    const book = yield db_js_1.default.query(queryString, [args.id]);
                    return book.rows[0];
                });
            },
        },
        //GET ALL BOOKS
        books: {
            type: new graphql_1.GraphQLList(BookType),
            resolve() {
                return __awaiter(this, void 0, void 0, function* () {
                    const queryString = `
        SELECT * FROM books
        `;
                    const books = yield db_js_1.default.query(queryString);
                    return books.rows;
                });
            },
        },
        //GET AUTHOR BY ID
        author: {
            type: AuthorType,
            args: { id: { type: graphql_1.GraphQLID } },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const queryString = `
        SELECT *
        FROM authors
        WHERE authors.id = $1
        `;
                    const author = yield db_js_1.default.query(queryString, [args.id]);
                    return author.rows[0];
                });
            },
        },
        //GET ALL AUTHORS
        authors: {
            type: new graphql_1.GraphQLList(AuthorType),
            resolve() {
                return __awaiter(this, void 0, void 0, function* () {
                    const queryString = 'SELECT * FROM authors';
                    const authors = yield db_js_1.default.query(queryString);
                    return authors.rows;
                });
            },
        },
        //GET ALL BOOKS BY AUTHOR
        booksByAuthor: {
            type: new graphql_1.GraphQLList(BookType),
            args: { name: { type: graphql_1.GraphQLString } },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const queryString = `
        SELECT books.*
        FROM ((books
        INNER JOIN  booksAuthors ON books.id = booksAuthors.BookId)
        INNER JOIN authors ON booksAuthors.AuthorId = authors.id)
        WHERE authors.name = $1
        `;
                    const books = yield db_js_1.default.query(queryString, [args.name]);
                    return books.rows;
                });
            },
        },
        //GET ALL GENRES
        genres: {
            type: new graphql_1.GraphQLList(GenreType),
            resolve() {
                return __awaiter(this, void 0, void 0, function* () {
                    const queryString = 'SELECT * FROM genres';
                    const genres = yield db_js_1.default.query(queryString);
                    return genres.rows;
                });
            },
        },
        //GET ALL BOOKS BY GENRE
        booksByGenre: {
            type: new graphql_1.GraphQLList(BookType),
            args: { genre: { type: graphql_1.GraphQLString } },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const queryString = `
        SELECT books.*
        FROM books
        INNER JOIN genres ON books.genre_id = genres.id
        WHERE genres.name = $1
        `;
                    const books = yield db_js_1.default.query(queryString, [args.genre]);
                    return books.rows;
                });
            },
        },
    },
});
// ================== //
// ===== MUTATIONS ==== //
// ================== //
const RootMutation = new graphql_1.GraphQLObjectType({
    name: 'RootMutationType',
    fields: {
        //ADD BOOK
        addBook: {
            type: BookType,
            args: {
                title: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                author: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                genre: { type: graphql_1.GraphQLString },
            },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const author = yield db_js_1.default.query(`SELECT id FROM authors WHERE name = '${args.author}'`);
                    const genre = yield db_js_1.default.query(`SELECT id FROM genres WHERE genres.name = '${args.genre}'`);
                    //const authorId: string = author.rows[0].id;
                    //const genreId: string = genre.rows[0].id;
                    const authorID = author.rows[0].id;
                    const genreID = genre.rows[0].id;
                    const queryString = `
        INSERT INTO books (title, genre_id)
        VALUES ($1, $2)
        RETURNING *`;
                    const bookResponse = yield db_js_1.default.query(queryString, [args.title, genreID]);
                    const newBook = bookResponse.rows[0];
                    newBook.author = args.author;
                    newBook.genre = args.genre;
                    const bookID = newBook.id;
                    const joinTableQueryString = `
        INSERT INTO booksauthors (bookid, authorid)
        VALUES ($1, $2)
        `;
                    yield db_js_1.default.query(joinTableQueryString, [bookID, authorID]);
                    return newBook;
                });
            },
        },
        //UPDATE BOOK
        updateBook: {
            type: BookType,
            args: {
                id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
                title: { type: graphql_1.GraphQLString },
                author: { type: graphql_1.GraphQLString },
                genre: { type: graphql_1.GraphQLString },
            },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (args.author) {
                        const authorQueryString = `
          UPDATE booksauthors
          SET booksauthors.authorID = authors.id
          FROM booksauthors 
          INNER JOIN authors ON booksauthors.authorID = authors.id
          WHERE booksauthors.bookID = ${args.id} AND authors.name = '${args.author}'
          `;
                        yield db_js_1.default.query(authorQueryString);
                    }
                    let bookQueryString = `
        SELECT * FROM books 
        WHERE books.id = ${args.id}
        `;
                    const toUpdate = [];
                    if (args.genre)
                        toUpdate.push(`genre_id = (SELECT id FROM genres WHERE genres.name = '${args.genre}')`);
                    if (args.title)
                        toUpdate.push(`title = '${args.title}'`);
                    if (toUpdate.length > 0) {
                        bookQueryString = `
          UPDATE books
          SET ${toUpdate.join()} 
          WHERE id = ${args.id}
          RETURNING *
          `;
                    }
                    const updatedBook = yield db_js_1.default.query(bookQueryString);
                    return updatedBook.rows[0];
                });
            },
        },
        //DELETE BOOK
        deleteBook: {
            type: BookType,
            args: {
                id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
            },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const queryString = `
          DELETE FROM books 
          WHERE id = ${args.id}
          RETURNING *
        `;
                    yield db_js_1.default.query(`DELETE FROM booksauthors WHERE bookid = ${args.id}`);
                    const deleted = yield db_js_1.default.query(queryString);
                    return deleted.rows[0];
                });
            },
        },
        //ADD AUTHOR
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                country: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
            },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const queryString = `
        INSERT INTO authors (name, country)
        VALUES ($1, $2)
        RETURNING *
        `;
                    const newAuthor = yield db_js_1.default.query(queryString, [
                        args.name,
                        args.country,
                    ]);
                    return newAuthor.rows[0];
                });
            },
        },
        //UPDATE AUTHOR
        updateAuthor: {
            type: AuthorType,
            args: {
                id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
                name: { type: graphql_1.GraphQLString },
                country: { type: graphql_1.GraphQLString },
            },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const toUpdate = [];
                    if (args.name)
                        toUpdate.push(`name='${args.name}'`);
                    if (args.country)
                        toUpdate.push(`country='${args.country}'`);
                    const queryString = `
        UPDATE authors
        SET ${toUpdate.join()}
        WHERE authors.id = ${args.id}
        RETURNING *
        `;
                    const updatedAuthor = yield db_js_1.default.query(queryString);
                    return updatedAuthor.rows[0];
                });
            },
        },
        //DELETE AUTHOR
        deleteAuthor: {
            type: AuthorType,
            args: {
                name: { type: graphql_1.GraphQLString },
            },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const queryString = `
        DELETE FROM authors
        WHERE name = '${args.name}'
        RETURNING *
        `;
                    const deletedAuthor = yield db_js_1.default.query(queryString);
                    return deletedAuthor.rows[0];
                });
            },
        },
        //ADD GENRE
        addGenre: {
            type: GenreType,
            args: {
                name: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
            },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const queryString = `
        INSERT INTO genres (name)
        VALUES ($1)
        RETURNING *
        `;
                    const newGenre = yield db_js_1.default.query(queryString, [args.name]);
                    return newGenre.rows[0];
                });
            },
        },
        //DELETE GENRE
        deleteGenre: {
            type: GenreType,
            args: {
                name: { type: graphql_1.GraphQLString },
            },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const queryString = `
        DELETE FROM genres
        WHERE name = '${args.name}'
        RETURNING *
        `;
                    const deletedGenre = yield db_js_1.default.query(queryString);
                    return deletedGenre.rows[0];
                });
            },
        },
    },
});
exports.default = new graphql_1.GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation,
    types: [BookType, AuthorType, GenreType],
});
