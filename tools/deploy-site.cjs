const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const checkout = path.join(root, '.deploy_profile');
const git = (args, cwd = checkout) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['inherit', 'pipe', 'inherit'] }).trim();

execFileSync(process.execPath, [path.join(__dirname, 'build-site.cjs')], { cwd: root, stdio: 'inherit' });
const repository = git(['remote', 'get-url', 'origin'], root);
if (!fs.existsSync(path.join(checkout, '.git'))) {
  git(['clone', '--single-branch', '--branch', 'main', repository, checkout], root);
} else {
  git(['fetch', 'origin', 'main']);
  git(['merge', '--ff-only', 'origin/main']);
}
git(['rm', '-r', '--ignore-unmatch', '.']);
fs.cpSync(path.join(root, 'dist'), checkout, { recursive: true });
git(['add', '--all']);
if (git(['diff', '--cached', '--name-only'])) git(['commit', '-m', 'Publish profile homepage and move blog to /blog/']);
console.log(git(['push', 'origin', 'HEAD:main']));
console.log('Published the complete site to the existing Pages main branch.');
