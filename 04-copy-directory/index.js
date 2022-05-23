const { resolve, join} = require('path');
const { readdir , mkdir, rmdir, copyFile } = require('fs').promises;

let path = join(__dirname, 'files');
let newPath = join(__dirname,'files-copy');

async function* files(path,newPath) {
  await rmdir(newPath, {recursive: true});
  await mkdir(newPath, {recursive: true});
  const dirs = await readdir(path, { withFileTypes: true });
  for (const dir of dirs) {
    const res = resolve(path, dir.name);
    const newRes = resolve(newPath, dir.name);
    if (dir.isDirectory()) {
      await mkdir(newRes, {recursive: true});
      yield* files(res,newRes);
    } else yield {res, newRes};
  }
}

(async () => {
  for await (const file of files(path,newPath)) {
    await copyFile(file.res,file.newRes);
  }
})();
