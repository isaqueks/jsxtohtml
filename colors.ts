
const colors = {
    'reset': "\x1b[0m",
    'red': "\x1b[31m",
    'green': "\x1b[32m"
}

export default function color(color: keyof typeof colors) {
    console.log(colors[color]);
}