import { prisma } from "../../lib/prisma.js";
import type { CreateProductDto } from "../dtos/productDto.js";

const productInclude = {
  categoria: true,
  numerosSerie: true,
} as const;

type ProductCreateData = Parameters<typeof prisma.produto.create>[0]["data"];

// verifica se a categoria existe antes de criar ou atualizar um produto
async function ensureCategoriaExists(categoriaId: string) {
  const categoria = await prisma.categoria.findUnique({
    where: {
      id: categoriaId,
    },
  });

  if (!categoria) {
    throw new Error("Categoria nao encontrada");
  }
}

// busca todos os produtos
export async function getAllProducts() {
  const result = await prisma.produto.findMany({
    include: productInclude,
    orderBy: {
      modelo: "asc",
    },
  });
}

// busca todas as categorias
export async function getCategories() {
  return prisma.categoria.findMany({
    orderBy: {
      nome: "asc",
    },
  });
}

// busca um produto pelo id
export async function getProductById(id: string) {
  const product = await prisma.produto.findUnique({
    where: {
      id,
    },
    include: productInclude,
  });

  if (!product) {
    throw new Error("Produto nao encontrado");
  }

  return product;
}

// cria um novo produto
export async function createProduct(productData: CreateProductDto) {
  await ensureCategoriaExists(productData.categoriaId);

  const data: ProductCreateData = {
    modelo: productData.modelo,
    fabricante: productData.fabricante,
    precoBase: productData.precoBase,
    qtdEstoque: productData.qtdEstoque,
    categoria: {
      connect: {
        id: productData.categoriaId,
      },
    },
  };

  return prisma.produto.create({
    data,
    include: productInclude,
  });
}

// atualiza um produto existente
export async function updateProduct(id: string, productData: CreateProductDto) {
  await ensureCategoriaExists(productData.categoriaId);

  const existingProduct = await prisma.produto.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!existingProduct) {
    throw new Error("Produto nao encontrado");
  }

  return prisma.produto.update({
    where: {
      id,
    },
    data: {
      modelo: productData.modelo,
      fabricante: productData.fabricante,
      precoBase: productData.precoBase,
      qtdEstoque: productData.qtdEstoque,
      categoria: {
        connect: {
          id: productData.categoriaId,
        },
      },
    },
    include: productInclude,
  });
}

// exclui um produto existente
export async function deleteProduct(id: string) {
  const existingProduct = await prisma.produto.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!existingProduct) {
    throw new Error("Produto nao encontrado");
  }

  await prisma.$transaction([
    prisma.numeroSerie.deleteMany({
      where: {
        produtoId: id,
      },
    }),
    prisma.produto.delete({
      where: {
        id,
      },
    }),
  ]);
}
