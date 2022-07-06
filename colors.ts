// import { bold, white, bgGreen, bgYellow, bgBrightBlack } from "https://deno.land/std@0.147.0/fmt/colors.ts";
import { bold, white, bgGreen, bgYellow, bgBrightBlack } from "colors";

const colorMethods = {
  green: bgGreen,
  yellow: bgYellow,
  gray: bgBrightBlack,
};

export function colorLetter(color: "green" | "yellow" | "gray", letter: string) {
  const bg = colorMethods[color];
  const colorizedLetter = bg(bold(` ${white(letter)} `));
  return ` ${colorizedLetter} `;
}
