const { resolve, join} = require('path');
const { readdir , mkdir, rm, copyFile } = require('fs').promises;

let path = join(__dirname, 'files');
let newPath = join(__dirname,'files-copy');

async function* files(path,newPath) {
  const dirs = await readdir(path, { withFileTypes: true });
  for (const dir of dirs) {
    const res = resolve(path, dir.name);
    const newRes = resolve(newPath, dir.name);
    if (dir.isDirectory()) {
      await mkdir(newRes, {recursive: true});
      yield* await files(res,newRes);
    } else yield {res, newRes};
  }
}
rm(newPath, {recursive: true, force: true})
  .then(mkdir(newPath, {recursive: true}))
  .then(async () => {
    for await (const file of files(path,newPath)) {
      await copyFile(file.res,file.newRes);
    }
  });
