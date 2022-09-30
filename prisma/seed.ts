import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const dynamicProductPassportData: Prisma.DynamicProductPassportCreateInput[] = [
    {
        qruid: 1234,
        repairs: {
            create: [
                {
                    description: 'repair shop 1'
                },
                {
                    description: 'repair shop 2'
                }
            ]
        }
    }
]

async function main() {
    console.log(`Start seeding ...`)
    for (const u of dynamicProductPassportData) {
        const dynamicProductPassport = await prisma.dynamicProductPassport.create({
            data: u
        })
        console.log(`Created dynamic product passport with id: ${dynamicProductPassport.id}`)
    }
    console.log(`Seeding finished.`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
