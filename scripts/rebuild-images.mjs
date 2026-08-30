import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const jobs = [
  ['tony-tattooing.webp', 'tony-tattooing'],
  ['tony-client-session.webp', 'tony-client-session'],
  ['tony-chicago-studio.webp', 'tony-chicago-studio'],
];

for (const [outputName, prefix] of jobs) {
  const chunkDir = path.join(root, 'image-chunks');
  if (!fs.existsSync(chunkDir)) continue;
  const parts = fs.readdirSync(chunkDir)
    .filter((name) => name.startsWith(prefix + '.') && name.endsWith('.b64'))
    .sort();
  if (!parts.length) continue;
  const encoded = parts.map((name) => fs.readFileSync(path.join(chunkDir, name), 'utf8')).join('');
  const out = path.join(root, 'public', 'images', outputName);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, Buffer.from(encoded, 'base64'));
  console.log(`rebuilt ${outputName}: ${fs.statSync(out).size} bytes`);
}
