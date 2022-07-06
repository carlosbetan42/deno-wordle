// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

const { Deno  } = globalThis;
const noColor = typeof Deno?.noColor === "boolean" ? Deno.noColor : true;
let enabled = !noColor;
function code(open, close) {
    return {
        open: `\x1b[${open.join(";")}m`,
        close: `\x1b[${close}m`,
        regexp: new RegExp(`\\x1b\\[${close}m`, "g")
    };
}
function run(str, code) {
    return enabled ? `${code.open}${str.replace(code.regexp, code.open)}${code.close}` : str;
}
function bold(str) {
    return run(str, code([
        1
    ], 22));
}
function white(str) {
    return run(str, code([
        37
    ], 39));
}
function bgGreen(str) {
    return run(str, code([
        42
    ], 49));
}
function bgYellow(str) {
    return run(str, code([
        43
    ], 49));
}
function bgBrightBlack(str) {
    return run(str, code([
        100
    ], 49));
}
new RegExp([
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))", 
].join("|"), "g");
const previousGuesses = [];
const ramdomId = Math.ceil(Math.random() * (905 - 1));
const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${ramdomId}`);
const data = await response.json();
const pokemon = data.name.toUpperCase();
let globalResults = "";
function askWord() {
    const response = prompt("The pokemon is ...");
    if (response == null) {
        return {
            error: "You must provide a posibble pokemon name"
        };
    } else if (response.length !== pokemon.length) {
        return {
            error: "The pokemon name must be " + pokemon.length + " characters long"
        };
    } else if (previousGuesses.includes(response.toUpperCase())) {
        return {
            error: "You already tried this pokemon name!"
        };
    } else if (!/^[a-zA-Z]+$/.test(response)) {
        return {
            error: "The pokemon name must containt only letters"
        };
    }
    return {
        response: response.toUpperCase()
    };
}
const colorMethods = {
    green: bgGreen,
    yellow: bgYellow,
    gray: bgBrightBlack
};
function colorLetter(color, letter) {
    const bg = colorMethods[color];
    const colorizedLetter = bg(bold(` ${white(letter)} `));
    return ` ${colorizedLetter} `;
}
function print(guess) {
    console.clear();
    let results = "";
    const letters = [
        ...guess
    ];
    letters.forEach((letter, index)=>{
        if (letter === pokemon[index]) {
            results += colorLetter("green", letter);
        } else if (pokemon.includes(letter)) {
            results += colorLetter("yellow", letter);
        } else {
            results += colorLetter("gray", letter);
        }
    });
    globalResults += `${results} \n\n`;
    console.log(globalResults);
}
function start(tries) {
    if (tries >= 6) {
        console.log("You lost!");
        console.log("The pokemon was " + pokemon);
        return;
    }
    let guess = "";
    while(guess === ""){
        const { error , response  } = askWord();
        if (error) {
            console.log(error);
            continue;
        }
        if (response) {
            guess = response;
        }
    }
    if (guess === pokemon) {
        print(guess);
        console.log("You win");
    } else {
        print(guess);
        console.log(" ");
        tries++;
        start(tries);
    }
}
console.log("Let's play a game! Guess the Pokemon Name");
console.log(`Hint: It has ${pokemon.length} characters... Good luck!`);
start(0);

