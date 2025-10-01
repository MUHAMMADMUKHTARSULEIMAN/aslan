const getENVVariable = (name: keyof typeof process.env): string => {
	if(!process.env[name]) {
		throw new Error(`Missing environment variable: ${name}`)
	}

	process.env[name] = process.env[name].trim()

	if(name === "NODE_ENV" && process.env[name] !== "development" && process.env[name] !== "production") {
		const error = new Error(`Invalid environment variable: ${name}`)
	}
	return process.env[name]
}

export default getENVVariable