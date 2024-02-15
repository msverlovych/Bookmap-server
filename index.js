const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const cors = require('cors')
const dotenv = require('dotenv')
const schema = require('./schema.js')

dotenv.config()

const app = express()
app.use(cors())

const $PORT = process.env.PORT || 3000

const root = {
    getBooks: async ({ query }) => {
        try {
            const response = await fetch(`${process.env.DEV_BASE_URL}?q=${query}&limit=4`)

            if (!response.ok) {
                console.log(response)

                switch (response.status) {
                    case 404:
                        throw new Error('No books found by your request!')
                        break;
                    case 500:
                        throw new Error('Something went wrong. Please try again later')
                        break;    
                    default: throw new Error('Something went wrong. Please try again later')
                        break;
                }
            }

            const data = await response.json()

            const books = data.docs.map(book => ({
                key: book.key || null,
                cover_edition_key: book.cover_edition_key || null,
                subject: (book.subject && book.subject.length > 0) ? book.subject[0] : null,
                title: book.title || null,
                author_name: (book.author_name && book.author_name.length > 0) ? book.author_name[0] : null
            }))

            return { docs: books }
        } catch (error) {
            return error
        }
    },

    getBooksBySearch: async ({ query, offset }) => {
        try {
            const response = await fetch(`${process.env.DEV_BASE_URL}?q=${query}&offset=${offset}&limit=10`)

            if (!response.ok) {
                console.log(response)

                switch (response.status) {
                    case 404:
                        throw new Error('No books found by your request!')
                        break;
                    case 500:
                        throw new Error('Something went wrong. Please try again later')
                        break;    
                    default: throw new Error('Something went wrong. Please try again later')
                        break;
                }
            }

            const data = await response.json()

            const books = data.docs.map(book => ({
                key: book.key || null,
                cover_edition_key: book.cover_edition_key || null,
                subject: (book.subject && book.subject.length > 0) ? book.subject[0] : null,
                title: book.title || null,
                author_name: (book.author_name && book.author_name.length > 0) ? book.author_name[0] : null
            }))

            return {
                numFound: data.numFound,
                q: data.q,
                offset: data.offset,
                docs: books,
            }
        } catch (error) {
            return error
        }
    },

    getSingleBook: async ({ cover_edition_key }) => {
        try {
            const response = await fetch(`${process.env.DEV_SINGLE_BOOK_URL}=${cover_edition_key}&format=json&jscmd=data`)
            
            if (!response.ok) {
                if (!response.ok) {
                    console.log(response)
    
                    switch (response.status) {
                        case 404:
                            throw new Error('Book not found')
                            break;
                        case 500:
                            throw new Error('Something went wrong. Please try again later')
                            break;    
                        default: throw new Error('Something went wrong. Please try again later')
                            break;
                    }
                }
            }

            const data = await response.json()

            if (!data || !data[cover_edition_key]) {
                throw new Error(`Book details not found`)
            }

            const bookDetails = data[cover_edition_key]
            
            const { key, title, publish_date } = bookDetails
            const author = (bookDetails.authors && bookDetails.authors.length > 0) ? bookDetails.authors[0].name : null
            const excerpts = (bookDetails.excerpts && bookDetails.excerpts.length > 0) ? bookDetails.excerpts[0].text : null
            const subjects =( bookDetails.subjects && bookDetails.subjects.length > 0) ? bookDetails.subjects.slice(0, 3).map(subject => subject.name) : null
            const cover = bookDetails.cover.large

            return { key, title, author, excerpts, publish_date, subjects, cover }
        } catch (error) {
            return error
        }
    }
}

app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: schema,
    rootValue: root
}))

app.listen($PORT, (error) => console.log(error ? error : `Server has been started on port: ${$PORT}`))