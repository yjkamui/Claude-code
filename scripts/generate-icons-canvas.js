const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'www', 'assets');
fs.mkdirSync(outDir, { recursive: true });

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
  { name: 'splash-2732x2732.png', size: 2732, splash: true },
];

function drawIcon(ctx, s) {
  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, s, s);

  const scale = s / 1024;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (s >= 60) {
    ctx.fillStyle = '#00ff88';
    ctx.font = `bold ${Math.round(300 * scale)}px Courier New, monospace`;
    ctx.fillText('C', s * 0.5, s * 0.42);

    if (s >= 120) {
      ctx.fillStyle = '#ffaa00';
      ctx.font = `${Math.round(80 * scale)}px Courier New, monospace`;
      ctx.fillText('DECODE', s * 0.5, s * 0.73);
    }
  } else {
    ctx.fillStyle = '#00ff88';
    ctx.font = `bold ${Math.round(500 * scale)}px Courier New, monospace`;
    ctx.fillText('C', s * 0.5, s * 0.52);
  }
}

function drawSplash(ctx, s) {
  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, s, s);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillStyle = '#00ff88';
  ctx.font = 'bold 120px Courier New, monospace';
  ctx.fillText('CRYPTOGRAM', s * 0.5, s * 0.4);

  ctx.fillStyle = '#888888';
  ctx.font = '50px Courier New, monospace';
  ctx.fillText('暗号解読ゲーム', s * 0.5, s * 0.5);

  ctx.fillStyle = '#ffaa00';
  ctx.font = '40px Courier New, monospace';
  ctx.fillText('DECODE THE QUOTES', s * 0.5, s * 0.58);
}

for (const { name, size, splash } of sizes) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  if (splash) {
    drawSplash(ctx, size);
  } else {
    drawIcon(ctx, size);
  }

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outDir, name), buffer);
  console.log(`Generated ${name} (${size}x${size})`);
}

console.log('All icons generated.');
