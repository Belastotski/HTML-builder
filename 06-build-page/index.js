const { resolve, join, parse} = require('path');
const { readdir , mkdir, rm, copyFile, readFile } = require('fs').promises;
const {createWriteStream, createReadStream} = require('fs');


let assetsPath = join(__dirname, 'assets');
let distPath = join(__dirname, 'project-dist');
let newAssetsPath = join(distPath,'assets');
const stylePath = join(__dirname, 'styles');
const templatePath = join(__dirname, './template.html');
const componentsPath = join(__dirname, 'components');
const newStylePath = join(__dirname, 'project-dist','./style.css');
const indexPath = join(__dirname, 'project-dist','./index.html');
// const index = createWriteStream(indexPath);

async function* getFiles(path) {
  const dirs = await readdir(path, { withFileTypes: true });
  for (const dir of dirs) {
    const res = resolve(path, dir.name);
    dir.isDirectory() ? yield* await getFiles(res) : yield res;
  }
}

async function* copyFiles(path,newPath) {
  const dirs = await readdir(path, { withFileTypes: true });
  for (const dir of dirs) {
    const res = resolve(path, dir.name);
    const newRes = resolve(newPath, dir.name);
    if (dir.isDirectory()) {
      await mkdir(newRes, {recursive: true});
      yield* copyFiles(res,newRes);
    } else yield {res, newRes};
  }
}


rm(distPath,{ recursive: true, force: true })
  .then(async () => mkdir(distPath, {recursive: true}))
  .then( async () => {
    for await (const file of copyFiles(assetsPath,newAssetsPath)) {
      await copyFile(file.res,file.newRes);
    }
  }).then(async () => {
    const bundle = createWriteStream(newStylePath);
    for await (const file of getFiles(stylePath)) {
      const {ext} = parse(file);
      if (ext === '.css') createReadStream(file).pipe(bundle);
    }
  })
  .then(async () => {
    const html = new Map(); 
    const bundle = createWriteStream(indexPath);
    for await (const file of getFiles(componentsPath)) {
      const {ext, name} = parse(file);
      if (ext === '.html') await readFile(file ,{encoding: 'utf8'}).then( text => html.set(name,text));
    }
    await readFile(templatePath, {encoding: 'utf8'})
      .then( text => (html.forEach( (val, key) => text = text.replace(`{{${key}}}`,val)),text))
      .then( text => bundle.write(text));
  });

