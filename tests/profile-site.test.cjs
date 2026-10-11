const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../dist');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

test('profile contains the supplied education and internship without GPA', () => {
  for (const text of ['National University of Singapore', 'Huazhong University of Science and Technology', 'Outstanding Graduate', 'Bilibili', 'User Technology Center', 'AI Agent Development for Content Creation', 'Shanghai', '2025.08', '2027.01', '2020.09', '2025.06', '2026.05', '2026.08']) assert.ok(html.includes(text), text);
  assert.doesNotMatch(html, /GPA|4\.88|88\.2|20XX|Repository 0/);
});

test('all profile anchors and content assets resolve', () => {
  for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(html.includes(`id="${id}"`), id);
  for (const [, asset] of html.matchAll(/(?:src|href)="(\/(?:assets\/[^"#]+|profile\.(?:css|js)))"/g)) assert.ok(fs.statSync(path.join(root, asset)).size > 0, asset);
});

test('profile links point to the requested destinations', () => {
  for (const href of ['/blog/', 'https://tsubaki-01.github.io/iris-web/', 'mailto:wengqiang9198@gmail.com', 'https://github.com/Tsubaki-01', 'https://github.com/agentscope-ai/agentscope', 'https://github.com/bytedance/deer-flow', 'https://github.com/lobehub/lobehub', 'https://github.com/ZLMediaKit/ZLMediaKit']) assert.ok(html.includes(`href="${href}"`), href);
  assert.equal((html.match(/class="repository-card"/g) || []).length, 4);
});

test('blog relocation preserves assets, special pages and old article URLs', () => {
  const blog = fs.readFileSync(path.join(root, 'blog/index.html'), 'utf8');
  assert.match(blog, /\/blog\/css\/main\.css/);
  assert.match(blog, /\/blog\/night-store\//);
  for (const file of ['blog/night-store/index.html', 'blog/night-store/app.js', 'blog/leetcode-hot-100/index.html', 'blog/archives/index.html', 'blog/2024/09/10/hello-world/index.html', '2024/09/10/hello-world/index.html']) assert.ok(fs.existsSync(path.join(root, file)), file);
  const redirects = fs.readdirSync(path.join(root, '2024/09/12'), { recursive: true }).filter(file => file.endsWith('index.html'));
  assert.ok(redirects.length > 0);
  for (const file of redirects) assert.match(fs.readFileSync(path.join(root, '2024/09/12', file), 'utf8'), /location\.replace\("\/blog\/2024\/09\/12\//);
});

