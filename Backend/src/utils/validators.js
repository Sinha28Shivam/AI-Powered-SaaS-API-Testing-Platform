import { z } from 'zod';

export const addApiSchema = z.object({
    name: z.string().min(1, "name is required").max(100, "Name is too long"),
    url: z.string().url("Must be a valid url"),
    method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']),
    headers: z.record(z.string(), z.string()).optional().default("")

});