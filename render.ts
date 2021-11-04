import ReactDOMServer from "react-dom/server";
import path from 'path';
import fs from 'fs';
import { JSDOM } from "jsdom";
import './css';
import { CSSPayload } from "./css";

async function checkFile(file: string) {
    try {
        await fs.promises.access(file, fs.constants.F_OK);
    }
    catch (e) {
        throw new Error(`Cannot access file "${file}".\n\t${e}`);
    }
}

async function checkFileDir(file: string) {
    try {
        const dir = path.dirname(file);
        const stat = await fs.promises.lstat(dir);
        if (!stat || !stat.isDirectory()) {
            throw new Error(`No such directory: ${dir} (parent directory of "${file}")`);
        }
    }
    catch (e) {
        throw new Error(`Invalid file name "${file}":\n\t${e}`);
    }
}

async function check(input, output, template, selector, cssFile, cssElement) {

    if (!input || !output) {
        throw new Error(`Both input and output required! Type "npm run jsxtohtml help" for help.`);
    }

    input = path.join(process.cwd(), input);
    output = path.join(process.cwd(), output);

    if (cssFile) {
        cssFile = path.join(process.cwd(), cssFile);
    }

    await checkFile(input);
    await checkFileDir(output);
    if (cssFile) {
        await checkFileDir(cssFile);
    }

    if (template) {
        if (!selector) {
            throw new Error(`By using a template, a selector should be specified! Type "npm run jsxtohtml help" for help.`);
        }
        template = path.join(process.cwd(), template);
        await checkFile(template);
    }
    if (selector && !template) {
        throw new Error(`Selector should be used with template! Type "npm run jsxtohtml help" for help.`);
    }
    if (cssElement && !template) {
        throw new Error(`CSS Element selector should be used with a template! Type "npm run jsxtohtml help" for help.`);
    }

    return [
        input,
        output,
        template,
        cssFile
    ]
}

async function renderTemplate(template: string, selector: string, cssElement: string, component, output: fs.WriteStream) {
    const jsdom = await JSDOM.fromFile(template);
    const dom = jsdom.window.document;

    const element = dom.querySelector(selector);
    if (!element) {
        throw new Error(`No such element "${selector}".`);
    }

    const rendered = ReactDOMServer.renderToString(component);
    element.innerHTML = rendered;

    if (cssElement) {
        const cssE = dom.querySelector(cssElement);
        if (!cssE) {
            throw new Error(`No such element "${cssE}" (CSS Element).`);
        }
        if (cssE.tagName.toLowerCase() != 'style') {
            console.warn(`Warning: CSS Element (${cssE}) is not a style element! Got "${cssE.tagName}".`);
        }
        cssE.innerHTML = CSSPayload.join(' ');
    }

    output.write(dom.documentElement.outerHTML);
    output.close();
}

export default async function render(props: {
    input: string,
    output: string,
    template: string,
    selector: string,

    cssFile: string,
    cssElement: string
}) {

    let { input, output, template, cssFile } = props;
    const { selector, cssElement } = props;

    [ input, output, template, cssFile ] = await check(input, output, template, selector, cssFile, cssElement);

    const componentExport = await import(input);
    if (!componentExport || !componentExport.default) {
        throw new Error(`Cannot import "${input}". Make sure it contains a default export to a functional component!`);
    }

    const component = componentExport.default;
    if (typeof component !== 'function') {
        throw new Error(`Cannot import "${input}". Make sure it contains a default export to a functional component!`);
    }

    const outputStream = fs.createWriteStream(output);


    if (template) {

        await renderTemplate(template, selector, cssElement, component(), outputStream);

    }
    else {
        ReactDOMServer.renderToNodeStream(component()).pipe(outputStream);
    }

    if (cssFile) {
        const cssStream = fs.createWriteStream(cssFile);
        for (const style of CSSPayload) {
            cssStream.write(style);
        }
        cssStream.close();
    }

    return true;

}
