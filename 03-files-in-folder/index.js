const { resolve, join, parse } = require('path');
const { readdir , stat } = require('fs').promises;

let path = join(__dirname, 'secret-folder');

async function* files(path) {
  const dirs = await readdir(path, { withFileTypes: true });
  for (const dir of dirs) {
    const res = resolve(path, dir.name);
    if(!dir.isDirectory())  yield res;
  }
}

(async () => {
  for await (const file of files(path)) {
    let {ext,name} = parse(file);
    ext = ext? ext.slice(1, ext.length): '';
    const {size} = await stat(file);
    console.log(`${name} - ${ext} - ${size > 1024 ? size/1024 +'kb' : size + 'b' }`);
  }
})();

