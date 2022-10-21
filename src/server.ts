require('dotenv').config()

import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { schema } from './schema'
import { context } from './context'

interface MyContext {
    token?: String
}

async function startApolloServer() {
    const server = new ApolloServer<MyContext>({ schema })

    const { url } = await startStandaloneServer(server, {
        context: context,
        listen: { port: 4000 }
    })

    console.log(`🚀  Server ready at ${url}`)
}

startApolloServer()
