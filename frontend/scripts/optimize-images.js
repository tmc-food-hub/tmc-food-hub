import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetImages = [
    'scheduled_platform_article.png',
    'services.png',
    'tmc_foodhub_platformm.png',
    'scheduled_platform_thumbnail.png',
    'AVAA\'S Logo.png'
];

const homeAssetsDir = path.join(__dirname, '..', 'public', 'assets', 'images');

async function convertToWebP() {
    for (const imgName of targetImages) {
        const startPath = path.join(homeAssetsDir, imgName);
        const newName = imgName.replace('.png', '.webp');
        const outPath = path.join(homeAssetsDir, newName);

        try {
            // Check if file exists first
            await fs.access(startPath);

            console.log(`Optimizing ${imgName}...`);
            await sharp(startPath)
                .webp({ quality: 80, effort: 6 }) // Convert lossy WebP, 80% quality, max effort for size optimization
                .toFile(outPath);

            const beforeStats = await fs.stat(startPath);
            const afterStats = await fs.stat(outPath);

            const savedBytes = beforeStats.size - afterStats.size;
            const savedPercent = ((savedBytes / beforeStats.size) * 100).toFixed(1);

            console.log(`✅ ${newName} created. Saved ${Math.round(savedBytes / 1024)} KB (${savedPercent}% reduction)`);
        } catch (err) {
            if (err.code === 'ENOENT') {
                console.warn(`⚠️ Skipped ${imgName}: File not found in directory.`);
            } else {
                console.error(`❌ Error converting ${imgName}:`, err);
            }
        }
    }
}

convertToWebP();
