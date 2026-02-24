import { NextFunction, Request, Response } from "express";
import { Prisma } from "../generated/prisma/client";

function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    let statusCode = 500;
    let errorMessage = "Something went wrong on our end. Please try again later.";
    
    // FIX: Instead of passing the whole 'err' object (which crashes JSON.stringify),
    // we manually build a safe object for development mode.
    let errorDetails = process.env.NODE_ENV === "development" ? {
        message: err.message,
        stack: err.stack,
        path: req.originalUrl,
        ...err // This spreads only serializable properties
    } : {};

    // 1. Prisma Validation Errors
    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = 400;
        errorMessage = "Invalid data provided. Please check your field types and required fields.";
    }

    // 2. Prisma Known Request Errors (Database Constraints)
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case "P2002":
                statusCode = 409; 
                errorMessage = `A record with this ${err.meta?.target || "unique field"} already exists.`;
                break;
            case "P2003":
                statusCode = 400;
                errorMessage = "Foreign key constraint failed. The related record does not exist.";
                break;
            case "P2025":
                statusCode = 404; 
                errorMessage = "The requested record was not found.";
                break;
            case "P2014":
                statusCode = 400;
                errorMessage = "The change you are trying to make would violate a required relation.";
                break;
            default:
                statusCode = 400;
                errorMessage = `Database error: ${err.message}`;
        }
    }

    // 3. Prisma Initialization / Connection Errors
    else if (err instanceof Prisma.PrismaClientInitializationError) {
        statusCode = 503; 
        if (err.errorCode === "P1001") {
            errorMessage = "Database server is unreachable. Check your network or database status.";
        } else if (err.errorCode === "P1017") {
            errorMessage = "Server has lost connection to the database.";
        } else {
            errorMessage = "Failed to initialize database connection.";
        }
    }

    // 4. Prisma Rust Engine / Timeout Errors
    else if (err instanceof Prisma.PrismaClientUnknownRequestError || err instanceof Prisma.PrismaClientRustPanicError) {
        statusCode = 500;
        errorMessage = "An unexpected database engine error occurred.";
    }

    // 5. Standard JavaScript/Express Errors
    else if (err instanceof Error) {
        errorMessage = err.message;
        if ('status' in err) {
            statusCode = (err as any).status;
        } else if ('statusCode' in err) {
            statusCode = (err as any).statusCode;
        }
    }

    // --- FINAL PROTECTION ---
    // If headers are already sent, don't try to send another response
    if (res.headersSent) {
        return next(err);
    }

    // Always log the error to your terminal for debugging
    console.error(`[Error] ${req.method} ${req.url}:`, errorMessage);

    res.status(statusCode).json({
        success: false,
        message: errorMessage,
        error: errorDetails,
    });
}

export default errorHandler;