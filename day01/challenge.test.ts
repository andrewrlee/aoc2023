import fs from "fs";

const rows = fs
  .readFileSync(`${__dirname}/input.txt`, "utf-8")
  .split("\n")
  .filter((l) => l);

const numberWords = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};
const numberLetters = {
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
};

const all = Object.entries({ ...numberWords, ...numberLetters });

describe("day01", () => {
  test("answer1", () => {
    const answer = rows
      .map((row) => {
        const result = [...row].filter((c) => c >= "0" && c <= "9");
        return parseInt(`${result.at(0)}${result.at(-1)}`);
      })
      .reduce((acc, i) => acc + i);

    expect(answer).toBe(54697);
  });

  test("answer2", () => {
    const answer = rows
      .map((row) => {
        const result = all
          .flatMap(([key, val]) => {
            const foundValues = [];
            let initial = -1;
            do {
              initial = row.indexOf(key, initial + 1);
              if (initial >= 0) {
                foundValues.push([initial, val]);
              }
            } while (initial > -1);
            return foundValues;
          })
          .sort(([a], [b]) => a - b);

        return parseInt(`${result[0][1]}${result.pop()?.[1]}`, 10);
      })
      .reduce((acc, i) => acc + i);

    expect(answer).toBe(54885);
  });
});
