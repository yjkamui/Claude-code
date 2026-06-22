const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <rect fill="#0a0a1a" width="1024" height="1024" rx="180"/>
  <text x="512" y="420" text-anchor="middle" font-family="Courier New, monospace"
        font-size="200" font-weight="bold" fill="#00ff88" letter-spacing="8">C R Y</text>
  <text x="512" y="620" text-anchor="middle" font-family="Courier New, monospace"
        font-size="200" font-weight="bold" fill="#00ff88" letter-spacing="8">P T O</text>
  <text x="512" y="780" text-anchor="middle" font-family="Courier New, monospace"
        font-size="80" fill="#ffaa00">DECODE</text>
  <g opacity="0.3">
    <text x="180" y="200" font-family="Courier New" font-size="60" fill="#00ff88">7</text>
    <text x="820" y="200" font-family="Courier New" font-size="60" fill="#00ff88">3</text>
    <text x="140" y="850" font-family="Courier New" font-size="60" fill="#00ff88">15</text>
    <text x="850" y="850" font-family="Courier New" font-size="60" fill="#00ff88">9</text>
  </g>
</svg>`;

const outDir = path.join(__dirname, '..', 'www', 'assets');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'icon.svg'), svgIcon);

const sizes = [
  { name: 'icon-20.png', size: 20 },
  { name: 'icon-20@2x.png', size: 40 },
  { name: 'icon-20@3x.png', size: 60 },
  { name: 'icon-29.png', size: 29 },
  { name: 'icon-29@2x.png', size: 58 },
  { name: 'icon-29@3x.png', size: 87 },
  { name: 'icon-40.png', size: 40 },
  { name: 'icon-40@2x.png', size: 80 },
  { name: 'icon-40@3x.png', size: 120 },
  { name: 'icon-60@2x.png', size: 120 },
  { name: 'icon-60@3x.png', size: 180 },
  { name: 'icon-76.png', size: 76 },
  { name: 'icon-76@2x.png', size: 152 },
  { name: 'icon-83.5@2x.png', size: 167 },
  { name: 'icon-1024.png', size: 1024 },
];

let hasConvert = false;
try {
  execSync('which convert', { stdio: 'ignore' });
  hasConvert = true;
} catch (e) {}

if (hasConvert) {
  for (const { name, size } of sizes) {
    const out = path.join(outDir, name);
    execSync(`convert -background none -density 300 -resize ${size}x${size} "${path.join(outDir, 'icon.svg')}" "${out}"`);
    console.log(`Generated ${name} (${size}x${size})`);
  }
} else {
  console.log('ImageMagick not found. SVG icon saved to www/assets/icon.svg');
  console.log('To generate PNGs, install ImageMagick and run: npm run build');
  console.log('Or use any SVG-to-PNG converter with the following sizes:');
  sizes.forEach(({ name, size }) => console.log(`  ${name}: ${size}x${size}`));
}
