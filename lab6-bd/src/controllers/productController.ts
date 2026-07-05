import type { Request, Response } from "express"
import { parseCreateProductDto } from "../dtos/productDto.js"
import {
	createProduct,
	getAllProducts,
	getCategories,
	getProductById,
} from "../services/productServices.js"

function getStatusCode(error: unknown) {
	if (!(error instanceof Error)) {
		return 500
	}

	if (error.message.includes("nao encontrado")) {
		return 404
	}

	if (
		error.message.includes("eh obrigatorio") ||
		error.message.includes("eh valido") ||
		error.message.includes("numero inteiro") ||
		error.message.includes("corpo da requisicao")
	) {
		return 400
	}

	return 500
}

function sendError(response: Response, error: unknown) {
	const status = getStatusCode(error)
	const message = error instanceof Error ? error.message : "Erro interno do servidor"

	return response.status(status).json({ message })
}

async function getAllProductsController(_request: Request, response: Response) {
	try {
		const products = await getAllProducts()
		return response.status(200).json(products)
	} catch (error) {
		return sendError(response, error)
	}
}

async function getCategoriesController(_request: Request, response: Response) {
	try {
		const categories = await getCategories()
		return response.status(200).json(categories)
	} catch (error) {
		return sendError(response, error)
	}
}

async function getProductByIdController(request: Request, response: Response) {
	try {
		const productId = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id

		if (typeof productId !== "string" || productId.length === 0) {
			throw new Error("O parametro id e obrigatorio")
		}

		const product = await getProductById(productId)
		return response.status(200).json(product)
	} catch (error) {
		return sendError(response, error)
	}
}

async function createProductController(request: Request, response: Response) {
	try {
		const productData = parseCreateProductDto(request.body)
		const product = await createProduct(productData)

		return response.status(201).json(product)
	} catch (error) {
		return sendError(response, error)
	}
}

export default {
	getAllProducts: getAllProductsController,
	getCategories: getCategoriesController,
	getProductById: getProductByIdController,
	createProduct: createProductController,
}
