export function getFirstApiError(error, fallback = 'Something went wrong. Please try again.') {
    const data = error?.response?.data;
    const validationErrors = data?.errors;

    if (validationErrors && typeof validationErrors === 'object') {
        for (const value of Object.values(validationErrors)) {
            if (Array.isArray(value) && value[0]) {
                return value[0];
            }

            if (typeof value === 'string' && value) {
                return value;
            }
        }
    }

    if (typeof data?.message === 'string' && data.message.trim()) {
        return data.message;
    }

    return fallback;
}

export function normalizeApiErrors(error, fieldMap = {}) {
    const validationErrors = error?.response?.data?.errors;

    if (!validationErrors || typeof validationErrors !== 'object') {
        return {
            general: [getFirstApiError(error)],
        };
    }

    return Object.entries(validationErrors).reduce((normalized, [key, value]) => {
        const targetKey = fieldMap[key] || key;

        normalized[targetKey] = Array.isArray(value) ? value : [String(value)];

        return normalized;
    }, {});
}
