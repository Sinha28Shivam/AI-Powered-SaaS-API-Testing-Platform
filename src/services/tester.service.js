import axios from 'axios';

/**
 * Service to execute dynamic HTTP requests to test APIs
 */
export const runApiTest = async (apiDefinition) => {
    const { url, method, headers, body } = apiDefinition;
    
    // Parse headers if it's sent as a stringified JSON
    let parsedHeaders = {};
    if (headers) {
        try {
            parsedHeaders = typeof headers === 'string' ? JSON.parse(headers) : headers;
        } catch (e) {
            console.warn("Failed to parse headers, proceeding without custom headers.");
        }
    }

    // Parse body if it's sent as a stringified JSON
    let parsedBody = undefined;
    if (body) {
        try {
            parsedBody = typeof body === 'string' ? JSON.parse(body) : body;
        } catch (e) {
            console.warn("Failed to parse body, proceeding with raw string.");
            parsedBody = body;
        }
    }

    const startTime = performance.now();
    let response;

    try {
        response = await axios({
            url,
            method: method.toLowerCase(),
            headers: parsedHeaders,
            data: ["post", "put", "patch"].includes(method.toLowerCase()) ? parsedBody : undefined,
            timeout: 10000, // 10 seconds timeout
            validateStatus: () => true, // Resolve promise even on error status codes (e.g. 404, 500) so we can capture them
        });
    } catch (error) {
        // Network errors or timeout
        const endTime = performance.now();
        return {
            responseTime: Math.round(endTime - startTime),
            status: error.code === 'ECONNABORTED' ? 408 : 503,
            responseData: { error: error.message },
            success: false
        };
    }

    const endTime = performance.now();
    
    return {
        responseTime: Math.round(endTime - startTime),
        status: response.status,
        responseData: response.data,
        success: response.status >= 200 && response.status < 300
    };
};
