import { colorLetter } from "./colors.ts";
import { writePokemonFile } from "./file.ts";
import { isGodMode } from "./env.ts";

const MAX_TRIES = 6;
const POKEMONS_AVAILABLE = 905;

const previousGuesses: Array<string> = [];
const ramdomId = Math.ceil(Math.random() * (POKEMONS_AVAILABLE - 1));

const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${ramdomId}`);
const data = await response.json();
const pokemon = data.name.toUpperCase();

if (isGodMode) {
  await writePokemonFile(pokemon);
}

let globalResults = "";

function askWord() {
  const response = prompt("The pokemon is ...");
  if (response == null) {
    return { error: "You must provide a posibble pokemon name" };
  } else if (response.length !== pokemon.length) {
    return { error: "The pokemon name must be " + pokemon.length + " characters long" };
  } else if (previousGuesses.includes(response.toUpperCase())) {
    return { error: "You already tried this pokemon name!" };
  } else if (!/^[a-zA-Z]+$/.test(response)) {
    return { error: "The pokemon name must containt only letters" };
  }

  return { response: response.toUpperCase() };
}

function print(guess: string) {
  console.clear();
  let results = "";

  const letters: Array<string> = [...guess];
  letters.forEach((letter, index) => {
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

function start(tries: number) {
  if (tries >= MAX_TRIES) {
    console.log("You lost!");
    console.log("The pokemon was " + pokemon);
    return;
  }

  let guess = "";
  while (guess === "") {
    const { error, response } = askWord();
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

let timesPlayed = +(localStorage.getItem("times_played") || 0);
timesPlayed++;
localStorage.setItem("times_played", timesPlayed.toString());

console.log("Let's play a game! Guess the Pokemon Name");
console.log(`Hint: It has ${pokemon.length} characters... Good luck!`);
console.log(`You have played ${timesPlayed} times`);
start(0);
