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
    let errorDetails = process.env.NODE_ENV === "development" ? err : {};

    // 1. Prisma Validation Errors
    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = 400;
        errorMessage = "Invalid data provided. Please check your field types and required fields.";
    }

    // 2. Prisma Known Request Errors (Database Constraints)
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case "P2002":
                statusCode = 409; // Conflict is often better for duplicates
                errorMessage = `A record with this ${err.meta?.target} already exists.`;
                break;
            case "P2003":
                statusCode = 400;
                errorMessage = "Foreign key constraint failed. The related record does not exist.";
                break;
            case "P2025":
                statusCode = 404; // Not Found is more standard for missing records
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
        statusCode = 503; // Service Unavailable
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
        // If it's a generic JS error, use its message if it's safe
        errorMessage = err.message;
        
        // Handle specific status codes if you throw custom errors elsewhere
        if ('status' in err) {
            statusCode = (err as any).status;
        }
    }

    res.status(statusCode).json({
        success: false,
        message: errorMessage,
        error: errorDetails,
    });
}

export default errorHandler;