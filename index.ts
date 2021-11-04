#!/usr/bin/env ts-node
import parseArgs from "./args";
import color from "./colors";
import render from "./render";

(async () => {

    try {
        color('reset');

        const args = parseArgs(process.argv.slice(2));
        
        if (!args || Object.keys(args).length === 0) {
            throw new Error(`Invalid arguments. User jsxtohtml help`);
        }
        if (args.help) {
            console.log(`Usage: npm run jsxtohtml -i <input JSX path> -o <output HTML path> [optional -t <template HTML file> -s <template element selector> -cssf <output css file> -csse <the style element selector to output css>]`);
            console.log(`Example: npm run jsxtohtml -i ./src/App.jsx -o static.html -t ./public/index.html -t div#root`);
        }

        if (await render(args as any) === true) {
            color('green');
            console.log('Success.');
            color('reset');
        }
        else {
            throw new Error(`Unknown error.`);
        }
        
    }
    catch (err) {
        color('red');
        console.error(String(err));
        color('reset');
    }

})();