/**
 * Crop an image using canvas, producing a high-quality output.
 * @param {string}  imageSrc  – object URL or data URL of the source image
 * @param {object}  cropArea  – { x, y, width, height } in px (from react-easy-crop)
 * @param {number}  outputWidth  – desired output width in px (e.g. 1600 for cover)
 * @param {number}  outputHeight – desired output height in px (e.g. 500 for cover)
 * @returns {Promise<Blob>}
 */
export default async function getCroppedImg(
    imageSrc,
    cropArea,
    outputWidth = null,
    outputHeight = null,
) {
    const image = await loadImage(imageSrc);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context unavailable');

    // Use output dimensions if provided, otherwise use crop dimensions
    const finalW = outputWidth || cropArea.width;
    const finalH = outputHeight || cropArea.height;

    canvas.width = finalW;
    canvas.height = finalH;

    // Enable high-quality scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
        image,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        finalW,
        finalH,
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    reject(new Error('Canvas toBlob failed'));
                    return;
                }
                resolve(blob);
            },
            'image/jpeg',
            0.92, // High quality JPEG
        );
    });
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}
