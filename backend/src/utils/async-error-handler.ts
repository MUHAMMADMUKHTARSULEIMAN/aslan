import {Request, Response, NextFunction, type RequestHandler} from "express"

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>

const asyncErrorHandler = (func: AsyncRequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(func(req, res, next)).catch(next)
  }
}

export default asyncErrorHandler