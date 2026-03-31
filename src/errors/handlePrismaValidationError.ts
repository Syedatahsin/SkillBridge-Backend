import { Prisma } from '../generated/prisma/client';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

/**
 * Handles Prisma Validation Errors
 * These occur when the data structure doesn't match the schema (e.g., wrong types)
 */
const handlePrismaValidationError = (
    err: Prisma.PrismaClientValidationError,
): TGenericErrorResponse => {
    const statusCode = 400;
    const errorMessage = err.message;

    // 1. Safe regex extraction
    // match() returns RegExpMatchArray | null
    const argumentMatch = errorMessage.match(/Argument `(\w+)`/);
    
    // 2. Ensure fieldName is strictly a string
    // Using optional chaining (?.[1]) and nullish coalescing (??)
    const fieldName: string = argumentMatch?.[1] ?? 'unknown';

    // 3. Clean up the message
    // Prisma validation errors often have long stack-like strings; 
    // we take the last line for a cleaner UI message.
    const cleanMessage = errorMessage.split('\n').filter(line => line.trim() !== '').pop() || 'Validation failed';

    const errorSources: TErrorSources = [
        {
            path: fieldName, // Matches 'string | number' perfectly now
            message: cleanMessage,
        },
    ];

    return {
        statusCode,
        message: 'Validation Error',
        errorSources,
    };
};

export default handlePrismaValidationError;