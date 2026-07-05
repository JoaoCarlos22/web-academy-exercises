import { readString, readNumber, readInt } from "../utils/validateTypes.js"

type RequestBody = Record<string, unknown>

export interface CreateProductDto {
	modelo: string
	fabricante: string
	precoBase: number
	qtdEstoque: number
	categoriaId: string
}

function assertObject(body: unknown): asserts body is RequestBody {
	if (body === null || typeof body !== "object" || Array.isArray(body)) {
		throw new Error("O corpo da requisicao deve ser um objeto valido")
	}
}

export function parseCreateProductDto(body: unknown): CreateProductDto {
	assertObject(body)

	return {
		modelo: readString(body.modelo, "modelo", true) as string,
		fabricante: readString(body.fabricante, "fabricante", true) as string,
		precoBase: readNumber(body.precoBase, "precoBase", true) as number,
		qtdEstoque: readInt(body.qtdEstoque, "qtdEstoque", true) as number,
		categoriaId: readString(body.categoriaId, "categoriaId", true) as string,
	}
}
