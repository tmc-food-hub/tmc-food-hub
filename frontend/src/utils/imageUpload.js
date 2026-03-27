const DEFAULT_MAX_IMAGE_DIMENSION = 1600;
const DEFAULT_IMAGE_QUALITY = 0.82;

function isImageFile(file) {
    return Boolean(file?.type?.startsWith?.('image/'));
}

function shouldSkipOptimization(file) {
    return file?.type === 'image/gif' || file?.type === 'image/svg+xml';
}

function loadImage(sourceUrl) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = sourceUrl;
    });
}

export function revokeObjectUrl(url) {
    if (url?.startsWith?.('blob:')) {
        URL.revokeObjectURL(url);
    }
}

export async function optimizeImageFile(
    file,
    {
        maxDimension = DEFAULT_MAX_IMAGE_DIMENSION,
        quality = DEFAULT_IMAGE_QUALITY,
    } = {},
) {
    if (!file || !isImageFile(file) || shouldSkipOptimization(file)) {
        return file;
    }

    const sourceUrl = URL.createObjectURL(file);

    try {
        const image = await loadImage(sourceUrl);
        const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) {
            throw new Error('Canvas unavailable');
        }

        canvas.width = width;
        canvas.height = height;
        context.drawImage(image, 0, 0, width, height);

        const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const blob = await new Promise((resolve, reject) => {
            canvas.toBlob((result) => {
                if (!result) {
                    reject(new Error('Unable to optimize image'));
                    return;
                }

                resolve(result);
            }, outputType, outputType === 'image/png' ? undefined : quality);
        });

        const extension = outputType === 'image/png' ? 'png' : 'jpg';
        const baseName = (file.name || 'upload-image').replace(/\.[^.]+$/, '');

        return new File([blob], `${baseName}.${extension}`, {
            type: outputType,
            lastModified: Date.now(),
        });
    } catch {
        return file;
    } finally {
        URL.revokeObjectURL(sourceUrl);
    }
}

export async function prepareImageUpload(file, options = {}) {
    if (!file) return null;

    const uploadFile = await optimizeImageFile(file, options);

    return {
        uploadFile,
        previewUrl: URL.createObjectURL(uploadFile),
    };
}
