
// import type { Request, Response, NextFunction } from "express";
// import httpStatus from "http-status";
// import AppError from "../errors/appError.js";

// const notFound = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   next(
//     new AppError(
//       httpStatus.NOT_FOUND,
//       `Route ${req.originalUrl} not found`
//     )
//   );
// };

// export default notFound;


import type { Request, Response } from "express";
import httpStatus from "http-status";

export const notFound = (req: Request, res: Response) => {
	res.status(httpStatus.NOT_FOUND).json({
		message: "Route not found",
		path: req.originalUrl,
		date: new Date(),
	});
};