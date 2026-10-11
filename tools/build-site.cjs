const fs = require('node:fs/promises');
const path = require('node:path');
const Hexo = require('hexo');

async function main() {
  const root = path.resolve(__dirname, '..');
  const output = path.join(root, 'dist');
  const blog = path.join(output, 'blog');
  await fs.rm(output, { recursive: true, force: true });
  const hexo = new Hexo(root, { config: '_config.yml,_config.blog.yml' });
  await hexo.init();
  await hexo.call('generate', { force: true });
  await hexo.exit();

  // Old posts and theme overrides contain root-relative asset URLs.
  // Rebase those generated references without rewriting the author's sources.
  for (const entry of await fs.readdir(blog, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile() || !/\.(html|css)$/.test(entry.name)) continue;
    const file = path.join(entry.parentPath || entry.path, entry.name);
    let text = await fs.readFile(file, 'utf8');
    text = text.replace(/((?:href|src|action|poster)=["'])\/(?!\/|blog(?:\/|["']))/g, '$1/blog/');
    text = text.replace(/(url\(\s*["']?)\/(?!\/|blog\/)/g, '$1/blog/');
    await fs.writeFile(file, text);

    // Preserve incoming links to existing posts, archives and static pages.
    const relative = path.relative(blog, file);
    if (!relative.endsWith('index.html') || relative === 'index.html') continue;
    const destination = '/blog/' + relative.split(path.sep).join('/').replace(/index\.html$/, '');
    const redirect = path.join(output, relative);
    await fs.mkdir(path.dirname(redirect), { recursive: true });
    await fs.writeFile(redirect, `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>博客页面已迁移</title><link rel="canonical" href="${destination}"><meta http-equiv="refresh" content="0;url=${destination}"><a href="${destination}">前往博客</a><script>location.replace(${JSON.stringify(destination)}+location.search+location.hash)</script></html>`);
  }
  await fs.cp(path.join(root, 'profile'), output, { recursive: true });
  await fs.writeFile(path.join(output, '.nojekyll'), '');
  console.log('Built profile at / and Hexo blog at /blog/ in dist/.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
