import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetImages = [
    'burger.png',
    'fries.png',
    'juice.png',
    'spag.png',
    'steak.png',
    'sushi.png'
];

const serviceAssetsDir = path.join(__dirname, '..', 'public', 'assets', 'images', 'service');

async function convertToWebP() {
    for (const imgName of targetImages) {
        const startPath = path.join(serviceAssetsDir, imgName);
        const newName = imgName.replace('.png', '.webp');
        const outPath = path.join(serviceAssetsDir, newName);

        try {
            await fs.access(startPath);
            console.log(`Optimizing ${imgName}...`);
            await sharp(startPath)
                .webp({ quality: 80, effort: 6 })
                .toFile(outPath);

            const beforeStats = await fs.stat(startPath);
            const afterStats = await fs.stat(outPath);

            const savedBytes = beforeStats.size - afterStats.size;
            const savedPercent = ((savedBytes / beforeStats.size) * 100).toFixed(1);

            console.log(`✅ ${newName} created. Saved ${Math.round(savedBytes / 1024)} KB (${savedPercent}% reduction)`);
        } catch (err) {
            console.error(`❌ Error converting ${imgName}:`, err);
        }
    }
}

convertToWebP();
