export function readString(value: unknown, field: string, required = false): string | undefined {
	if (value === undefined || value === null) {
		if (required) {
			throw new Error(`O campo ${field} eh obrigatorio`)
		}

		return undefined
	}

	if (typeof value !== "string") {
		throw new Error(`O campo ${field} deve ser uma string`)
	}

	const normalized = value.trim()

	if (required && normalized.length === 0) {
		throw new Error(`O campo ${field} eh obrigatorio`)
	}

	return normalized.length > 0 ? normalized : undefined
}

export function readNumber(value: unknown, field: string, required = false): number | undefined {
	if (value === undefined || value === null) {
		if (required) {
			throw new Error(`O campo ${field} eh obrigatorio`)
		}

		return undefined
	}

	const normalized = typeof value === "number" ? value : Number(value)

	if (!Number.isFinite(normalized)) {
		throw new Error(`O campo ${field} deve ser um numero valido`)
	}

	return normalized
}

export function readInt(value: unknown, field: string, required = false): number | undefined {
	const normalized = readNumber(value, field, required)

	if (normalized === undefined) {
		return undefined
	}

	if (!Number.isInteger(normalized)) {
		throw new Error(`O campo ${field} deve ser um numero inteiro`)
	}

	return normalized
}