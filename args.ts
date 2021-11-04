
interface Args {
    input?: string;
    output?: string;
    template?: string;
    selector?: string;
    cssFile?: string;
    cssElement?: string;
    help?: boolean;
}

const slugs = {
    '-i': 'input',
    '-o': 'output',
    '-t': 'template',
    '-s': 'selector',
    '-cssf': 'cssFile',
    '-csse': 'cssElement'
}

export default function parseArgs(args: string[]): Args {
    const parsed: Args = {};

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        if (arg === '-h' || arg === 'help' || arg === '?') {
            parsed.help = true;
            continue;
        }

        const slug = slugs[arg];
        if (!slug) {
            throw new Error(`Unknown argument "${arg}".`);
        }

        const value = args[++i];
        if (value && value[0] === '-') {
            i--;
            parsed[slug] = true;
            continue;
        }
        parsed[slug] = value || true;
    }

    return parsed;
}