import "dotenv/config"
import { randomUUID } from "node:crypto"
import { prisma } from "../lib/prisma.js"

const defaultCategories = [
  "Tecnologia",
  "Informatica",
  "Celulares",
  "Audio",
  "Games",
  "Eletrodomesticos",
  "Casa e Cozinha",
  "Acessorios",
]

async function main() {
  const existingCategories = await prisma.categoria.findMany({
    select: {
      nome: true,
    },
  })

  const existingNames = new Set(existingCategories.map((category) => category.nome))
  const categoriesToCreate = defaultCategories
    .filter((categoryName) => !existingNames.has(categoryName))
    .map((categoryName) => ({
      id: randomUUID(),
      nome: categoryName,
    }))

  if (categoriesToCreate.length > 0) {
    await prisma.categoria.createMany({
      data: categoriesToCreate,
    })
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })