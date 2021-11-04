# jsxtohtml
## A CLI tool to convert JSX/React components to plain and static HTML
<hr>

## What is it?
`jsxtohtml` is a CLI tool that can compile React components (or JSX) to plain and static HTML. It also bundles all the styles in a single file and provides a SASS compiler. 

## Installation
You can install it directly from GitHub: `npm i -d https://github.com/isaqueks/jsxtohtml`
Note: As it runs directly in TypeScript (with ts-node), the installer will create a `.jsxtohtml` directory in project root and copy the module files to it. This is because the TypeScript compiler natively supports JSX syntax, and ts-node can't run files inside `node_modules`. Don't forget to include `.jsxtohtml` in your `.gitignore` file!

## Usage
`npm run jsxtohtml -- <options>`  
Options are:

    
    -i The input JSX/TSX file <required>
    -o The output HTML file <required>
    -t The template HTML file <optional>
    -s The template container element selector <required if using template>
    -cssf The output CSS file <optional>
    -csse The template style element selector to insert CSS in. <optional>

Example: `npm run jsxtohtml -- -i ./src/App.jsx -o ./output/static.html -t ./public/index.html -s div#root -cssf ./output/style.css`   
Note: The `--` is to tell npm to pass the arguments to `jsxtohtml`

## Styles/SASS compiler
In a React component, it's very common to use `import './style.css'` to import the component styles. By doing that, you must specify `jsxtohtml` what to do with the styles, otherwise `jsxtohtml` will just ignore them. By using the `-cssf` option (which stands for "cssfile"), you can specify a output CSS file to output all the styles in a single file. By using the `-csse` option (which stands for "csselement"), you can specify a style element selector to output the CSS to (like `<style>...css stuff...</style>`). By using `-csse`, you must use a template too.  

By default, `jsxtohtml` will compile all SASS/SCSS files to plain CSS, so you in the component's code you can directly include the SASS/SCSS files: `import './style.scss';`

## Template
By not using a template, `jsxtohtml` will only output the component's rendered HTML. By using a template, you can define a HTML structure and specify via the `-s` option the container element which will wrap the rendered HTML. You can also create a style element and specify it selector to `jsxtohtml` to directly include the CSS content inside the `style` element.   
When using `create-react-app`, React will automatically create a `public/index.html` template with a `div#root` container.

## Issues
If you find any issue, please, report it directly here on GitHub.