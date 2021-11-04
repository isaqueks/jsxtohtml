import fs from 'fs';
import sass from 'sass';

export const STYLE_EXTENSIONS = [
    '.css',
    '.scss',
    '.sass'
]

export const CSSPayload = [];

export let oldHandlers = {}

export function handleCss(mod) {
    const { filename } = mod;

    const ext = filename.toLowerCase().split('.').pop();

    if (ext === 'css') {
        CSSPayload.push(fs.readFileSync(filename).toString());
    }
    else if (ext === 'scss' || ext === 'sass') {
        const result = sass.renderSync({
            file: filename
        });
        CSSPayload.push(result.css.toString());
    }
    
}

export default function register(extensions = STYLE_EXTENSIONS, handler = handleCss) {
    for (const ext of extensions) {
        require.extensions[ext] = handler
    }
}

// Run at import
register()