try {
const fs = require('fs');
const path = require('path');

const projPath = path.join(process.cwd(), '../../');
const packJson = path.join(projPath, 'package.json');

console.log(
`
Installing JSXtoHTML
GitHub repo: https://github.com/isaqueks/jsxtohtml/
===================================================
This will create a .jsxtohtml directory at project
root and copy the module contents to it. Not the 
best practice, but works. 
===================================================
`
);

const targetDir = path.join(projPath, '.jsxtohtml');
if (fs.existsSync(targetDir)) {
    throw new Error('Error There is already a .jsxtohtml directory. Remove this directory and reinstall the package.');
}

if (!fs.existsSync(packJson)) {
    throw new Error(`No package.json found! "${packJson}"`);
}

const package = JSON.parse(fs.readFileSync(packJson).toString());
if (!package.scripts) {
    package.scripts = {};
}

package.scripts['jsxtohtml'] = 'ts-node ./jsxtohtml/index.ts';
fs.writeFileSync(packJson, JSON.stringify(package));

fs.mkdirSync(targetDir);

const files = fs.readdirSync(process.cwd());
files.forEach(file => {
    if (file.endsWith('tsconfig.json') || file.endsWith('.ts')) {
        fs.copyFileSync(path.join(process.cwd(), file), path.join(targetDir, file));
    }
});

console.log(`
JSXtoHTML installed.
Run "npm run jsxtohtml help" for help.
`);

}
catch (err) {
    console.error(`Error while installing jsxtohtml:\n - ${err}`);
}