import { intArg, makeSchema, nonNull, objectType, inputObjectType, arg, asNexusMethod } from 'nexus'
import { DateTimeResolver } from 'graphql-scalars'
import { Context } from './context'

export const DateTime = asNexusMethod(DateTimeResolver, 'date')

const Query = objectType({
    name: 'Query',
    definition(t) {
        t.nonNull.list.nonNull.field('allDynamicProductPassports', {
            type: 'DynamicProductPassport',
            resolve: (_parent, _args, context: Context) => {
                return context.prisma.dynamicProductPassport.findMany()
            }
        })

        t.nullable.field('dynamicProductPassportByQruid', {
            type: 'DynamicProductPassport',
            args: {
                qruid: intArg()
            },
            resolve: (_parent, args, context: Context) => {
                return context.prisma.dynamicProductPassport.findUnique({
                    where: { qruid: args.qruid || undefined }
                })
            }
        })
    }
})

const Mutation = objectType({
    name: 'Mutation',
    definition(t) {
        t.nonNull.field('createDynamicProductPassport', {
            type: 'DynamicProductPassport',
            args: {
                data: nonNull(
                    arg({
                        type: 'DynamicProductPassportCreateInput'
                    })
                )
            },
            resolve: (_, args, context: Context) => {
                const repairData = args.data.repairs?.map((repair) => {
                    return { description: repair.description || undefined }
                })

                return context.prisma.dynamicProductPassport.create({
                    data: {
                        qruid: args.data.qruid,
                        repairs: {
                            create: repairData
                        }
                    }
                })
            }
        })

        t.field('createRepair', {
            type: 'Repair',
            args: {
                data: nonNull(
                    arg({
                        type: 'RepairCreateInput'
                    })
                ),
                passportId: nonNull(intArg())
            },
            resolve: (_, args, context: Context) => {
                return context.prisma.repair.create({
                    data: {
                        description: args.data.description,
                        passport: {
                            connect: { id: args.passportId }
                        }
                    }
                })
            }
        })
    }
})

const DynamicProductPassport = objectType({
    name: 'DynamicProductPassport',
    definition(t) {
        t.nonNull.int('id')
        t.nonNull.int('qruid')
        t.nonNull.field('createdAt', { type: 'DateTime' })
        t.nonNull.field('updatedAt', { type: 'DateTime' })
        t.nonNull.list.nonNull.field('repairs', {
            type: 'Repair',
            resolve: (parent, _, context: Context) => {
                return context.prisma.dynamicProductPassport
                    .findUnique({
                        where: { id: parent.id || undefined }
                    })
                    .repairs()
            }
        })
    }
})

const Repair = objectType({
    name: 'Repair',
    definition(t) {
        t.nonNull.int('id')
        t.string('description')
        t.nonNull.field('createdAt', { type: 'DateTime' })
        t.field('passport', {
            type: 'DynamicProductPassport',
            resolve: (parent, _, context: Context) => {
                return context.prisma.repair
                    .findUnique({
                        where: { id: parent.id || undefined }
                    })
                    .passport()
            }
        })
    }
})

const DynamicProductPassportCreateInput = inputObjectType({
    name: 'DynamicProductPassportCreateInput',
    definition(t) {
        t.nonNull.int('qruid')
        t.list.nonNull.field('repairs', { type: 'RepairCreateInput' })
    }
})

const RepairCreateInput = inputObjectType({
    name: 'RepairCreateInput',
    definition(t) {
        t.string('description')
    }
})

export const schema = makeSchema({
    types: [
        DateTime,
        Query,
        Mutation,
        DynamicProductPassport,
        Repair,
        DynamicProductPassportCreateInput,
        RepairCreateInput
    ],
    outputs: {
        schema: __dirname + '/../schema.graphql',
        typegen: __dirname + '/generated/nexus.ts'
    },
    contextType: {
        module: require.resolve('./context'),
        export: 'Context'
    },
    sourceTypes: {
        modules: [
            {
                module: '@prisma/client',
                alias: 'prisma'
            }
        ]
    }
})
