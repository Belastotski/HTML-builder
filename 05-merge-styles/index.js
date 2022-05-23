const { resolve, join, parse } = require('path');
const { readdir } = require('fs').promises;
const {createWriteStream, createReadStream} = require('fs');

const path = join(__dirname, 'styles');
const distPath = join(__dirname, 'project-dist','./bundle.css');
const bundle = createWriteStream(distPath);

async function* files(path) {
  const dirs = await readdir(path, { withFileTypes: true });
  for (const dir of dirs) {
    const res = resolve(path, dir.name);
    dir.isDirectory() ? yield* files(res) : yield res;
  }
}

(async () => {
  for await (const file of files(path)) {
    const {ext} = parse(file);
    if (ext === '.css') createReadStream(file).pipe(bundle);
  }
})();

