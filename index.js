#!/usr/bin/env node
// the above line is called shebang line, it tells the shell to execute the script using node

import chalk from 'chalk';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import gradient from 'gradient-string';
import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';

let playerName;
let playerScore = 0;

const sleep = (ms = 2000) => new Promise((resolve) => setTimeout(resolve, ms));

async function welcome() {
  console.log(gradient.rainbow(figlet.textSync('Welcome to the Game', { horizontalLayout: 'full' })));
  const { name } = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What is your name?',
      default: 'Player',
    },
  ]);
  playerName = name;
  console.log(`Welcome ${chalk.bold(playerName)}!`);
}

await welcome();

async function play() {
  const { answer } = await inquirer.prompt([
    {
      type: 'list',
      name: 'answer',
      message: 'What do you want to do?',
      choices: ['Play', 'Exit'],
    },
  ]);

  if (answer === 'Exit') {
    const animation = chalkAnimation.rainbow(`Your score is ${playerScore}`);
    await sleep();
    animation.stop();
    console.log('Bye!');
    process.exit(0);
  }

  const { number } = await inquirer.prompt([
    {
      type: 'input',
      name: 'number',
      message: 'Guess a number between 1 and 10',
      validate: (value) => {
        const valid = !Number.isNaN(parseFloat(value));
        return valid || 'Please enter a number';
      },
      filter: Number,
    },
  ]);

  const spinner = createSpinner('Loading...');
  spinner.start();

  await sleep();

  const randomNumber = Math.floor(Math.random() * 10) + 1;

  if (number === randomNumber) {
    spinner.success('You guessed right!');
    playerScore += 1;
  } else {
    spinner.error(`You guessed wrong! The right number was ${randomNumber}`);
  }

  console.log(`Your score is ${chalk.bold(playerScore)}`);

  await play();
}

await play();
