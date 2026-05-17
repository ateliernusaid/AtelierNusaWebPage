import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webDir = __dirname;
const publicDir = path.join(webDir, 'public');

const htmlFiles = fs.readdirSync(webDir).filter(f => f.endsWith('.html'));

let totalFixed = 0;

async function processFiles() {
    for (const file of htmlFiles) {
        const filePath = path.join(webDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let fileModified = false;

        // Extract all img tags
        const imgRegex = /<img\s([^>]+)>/gi;
        let match;
        let offset = 0;
        let newContent = '';
        
        while ((match = imgRegex.exec(content)) !== null) {
            const fullTag = match[0];
            const attrs = match[1];
            
            // Append content before this match
            newContent += content.substring(offset, match.index);
            offset = match.index + fullTag.length;
            
            if (attrs.includes('width=') && attrs.includes('height=')) {
                newContent += fullTag;
                continue;
            }

            const srcMatch = attrs.match(/src=["'](.*?)["']/i);
            if (!srcMatch) {
                newContent += fullTag;
                continue;
            }
            
            let src = srcMatch[1].split('?')[0];
            if (src.startsWith('http') || src.startsWith('data:')) {
                newContent += fullTag;
                continue;
            }

            let localImgPath = path.join(publicDir, src);
            if (!fs.existsSync(localImgPath)) {
                localImgPath = path.join(webDir, src);
            }

            if (fs.existsSync(localImgPath)) {
                try {
                    const metadata = await sharp(localImgPath).metadata();
                    let newAttrs = attrs;
                    if (!attrs.includes('width=')) {
                        newAttrs += ` width="${metadata.width}"`;
                    }
                    if (!attrs.includes('height=')) {
                        newAttrs += ` height="${metadata.height}"`;
                    }
                    
                    newContent += `<img ${newAttrs.trim()}>`;
                    fileModified = true;
                    totalFixed++;
                } catch (err) {
                    console.error(`Error reading ${localImgPath}: ${err.message}`);
                    newContent += fullTag;
                }
            } else {
                newContent += fullTag;
            }
        }
        
        newContent += content.substring(offset);

        if (fileModified) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`✅ Fixed CLS issues in ${file}`);
        }
    }
    
    console.log(`\n🎉 Total images fixed: ${totalFixed}`);
}

processFiles().catch(console.error);
