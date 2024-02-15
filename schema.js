const { buildSchema } = require('graphql')

const schema = buildSchema(`
    type Book {
        key: ID
        cover_edition_key: String
        subject: String
        author_name: String
        title: String
    }

    type BookResponse {
        numFound: Int,
        q: String,
        offset: Int!,
        docs: [Book]
    }

    type SingleBookResponse {
        key: ID,
        title: String,
        author: String,
        publish_date: String,
        subjects: [String],
        excerpts: String,
        cover: String
    }

    type Query {
        getBooks(query: String!): BookResponse
        getBooksBySearch(query: String!, offset: Int!): BookResponse
        getSingleBook(cover_edition_key: String!): SingleBookResponse
    }
`)

module.exports = schema