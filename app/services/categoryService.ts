import prisma from '@/prisma/prisma'

export async function getCategories() {
    try {
        const categories = await prisma.category.findMany()
        // console.log(categories)
        return categories
    } catch (error) {
        return ({ error })
    }
}