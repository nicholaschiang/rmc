const fs = require('fs/promises');
const path = require('path');
const example = require('./example.json');

function caps(s) {
  return s.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
}

async function createPackageJSONs() {
  const dir = path.resolve(__dirname, '../packages');
  const pkgs = await fs.readdir(dir);
  for (const pkg of pkgs) {
    example.name = pkg;
    example.description = `RMC ${caps(pkg.split('-').join(' '))} Component`;
    example.homepage = `https://github.com/nicholaschiang/rmc/tree/master/packages/${pkg}#readme`;
    const file = await fs.open(`${dir}/${pkg}/package.json`, 'w');
    await file.write(JSON.stringify(example, null, 2));
  }
}

if (require.main === module) createPackageJSONs();
