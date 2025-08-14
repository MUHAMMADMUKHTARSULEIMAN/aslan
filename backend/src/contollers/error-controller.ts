import type {Request, Response, NextFunction } from "express"
import CustomError, { type ErrorDetails} from "../utils/custom-error"
import config from "../config/config"

const {nodeENV} = config

interface ValidationError {
  properties: {
    message: string
    path: string
    value: any
  };
  message: string
  path: string
}

export interface CustomErrorType extends Error {
	isOperational: boolean
	statusCode: number
	status: string
	value: any
	path: string
	errors: Record<string, ValidationError>
	errorDetails?: ErrorDetails
}

const devErrors = (error: CustomErrorType, res: Response) => {
	res.status(error.statusCode).json({
		statusCode: error.statusCode,
		status: error.status,
		message: error.message,
		stactTrace: error.stack,
		error,
	})
}

const prodErrors = (error: CustomErrorType, res: Response) => {
	console.log(error)
	if(error.errorDetails) {
		res.status(error.statusCode).json({
			statusCode: error.statusCode,
			status: error.status,
			message: error.message,
			errors: error.errorDetails
		})
	}
	else if(error.isOperational) {
		res.status(error.statusCode).json({
			statusCode: error.statusCode,
			status: error.status,
			message: error.message,
		})
	}
	else {
		res.status(500).json({
			statusCode: 500,
			status: "Internal Server Error",
			message: "Something went wrong. Please try again later."
		})
	}
}

const validationErrorHandler = (error: CustomErrorType) => {
	const errorDetails = Object.entries(error.errors)
    .map(([field, value]) => ({
      field,
      message: value.message,
      value: value.properties.value
    }))

  const message = `Invalid data: ${errorDetails
    .map(err => `${err.field}: ${err.message}`)
    .join(". ")}`
  return new CustomError(400, message, errorDetails)
};

const globalErrorHandler = (
	error: CustomErrorType,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	error.statusCode = error.statusCode || 500;
  error.message = error.message || "Internal Server Error"

	if(nodeENV === "development") {
		devErrors(error, res)
	} else {
		if(error.name === "ValidationError") error = validationErrorHandler(error)

		prodErrors(error, res)
	}
}

export default globalErrorHandler