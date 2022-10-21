import { isTokenValid } from './validate'
import { StandaloneServerContextFunctionArgument } from '@apollo/server/dist/esm/standalone'
import { PrismaClient } from '@prisma/client'
import { GraphQLError } from 'graphql'

export interface UserInterface {
    name: string
    roles: string[]
    permissions: string[]
}

export interface Context {
    prisma: PrismaClient
    user?: UserInterface
}

const prisma = new PrismaClient()

export const context = async ({
    req
}: StandaloneServerContextFunctionArgument): Promise<Context> => {
    const token = req.headers.authorization || ''
    const result = await isTokenValid(token)

    const user: UserInterface = {
        name: 'lex',
        roles: ['TEST'],
        permissions: ['read:repairs', 'read:dynamicProductPassports']
    }

    if (!user) {
        throw new GraphQLError('User is not authenticated')
    }

    return { prisma, user }
}
