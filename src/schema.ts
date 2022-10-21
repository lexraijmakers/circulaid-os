import { DynamicProductPassport, Repair } from 'nexus-prisma'
import { makeSchema, objectType, queryType, fieldAuthorizePlugin } from 'nexus'
import NexusPrismaScalars from 'nexus-prisma/scalars'
import { Context } from './context'

const DynamicProductPassportObject = objectType({
    name: DynamicProductPassport.$name,
    description: DynamicProductPassport.$description,
    definition(t) {
        t.field(DynamicProductPassport.id)
        t.field(DynamicProductPassport.qruid)
        t.field(DynamicProductPassport.createdAt)
        t.field(DynamicProductPassport.updatedAt)
        t.field(DynamicProductPassport.repairs)
    }
})

const RepairObject = objectType({
    name: Repair.$name,
    description: Repair.$description,
    definition(t) {
        t.field(Repair.id)
        t.field(Repair.createdAt)
        t.field(Repair.description)
        t.field(Repair.passport)
        t.field(Repair.passportId)
    }
})

const Query = queryType({
    definition(t) {
        t.nonNull.list.nonNull.field('repairs', {
            type: 'Repair',
            authorize: (_, __, { user }: Context) => user?.permissions?.includes('read:repairs'),
            resolve(_, __, ctx: Context) {
                return ctx.prisma.repair.findMany()
            }
        })
        t.nonNull.list.nonNull.field('dynamicProductPassports', {
            type: 'DynamicProductPassport',
            authorize: (_, __, { user }: Context) =>
                user?.permissions?.includes('read:dynamicProductPassports'),
            resolve(_, __, ctx: Context) {
                return ctx.prisma.dynamicProductPassport.findMany()
            }
        })
    }
})

export const schema = makeSchema({
    types: [NexusPrismaScalars, DynamicProductPassportObject, RepairObject, Query],
    plugins: [fieldAuthorizePlugin()]
})
