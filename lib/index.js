'use strict';

var _vorpal = require('vorpal');

var _vorpal2 = _interopRequireDefault(_vorpal);

var _inquirer = require('inquirer');

var _lib = require('./lib');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const cli = (0, _vorpal2.default)();

const askForQuestions = [{
  type: 'input',
  name: 'numQuestions',
  message: 'How many questions do you want in your quiz?',
  validate: input => {
    const pass = input.match(/^[1-9]{1}$|^[1-9]{1}[0-9]{1}$|^100$/);
    return pass ? true : 'Please enter a valid number!';
  }
}, {
  type: 'input',
  name: 'numChoices',
  message: 'How many choices should each question have?',
  validate: input => {
    const pass = input.match(/^(?:[2-4]|0[2-4]|4)$/);
    return pass ? true : 'Please enter a valid number!';
  }
}];

const createQuiz = title => {
  return (0, _inquirer.prompt)(askForQuestions).then(answer => {
    answer['numQuestions'] = parseInt(answer['numQuestions']);
    answer['numChoices'] = parseInt(answer['numChoices']);
    return answer;
  }).catch(err => console.log('Error creating the quiz.', err)).then(ans => {
    return (0, _inquirer.prompt)((0, _lib.createPrompt)(ans));
  }).then(ans => {
    return (0, _lib.createQuestions)(ans);
  }).then(ans => {
    (0, _lib.writeFile)(title, ans);
  });
};

cli.command('create <fileName>', 'Creates a new quiz and saves it to the given fileName').action(function (input, callback) {
  // TODO update create command for correct functionality
  return createQuiz(input.fileName).then(ans => {
    // console.log(ans)
  });
});

cli.command('take <fileName> <outputFile>', 'Loads a quiz and saves the users answers to the given outputFile').action(function (input, callback) {
  var ourGuy = input.fileName;
  var theirGuy = input.outputFile;
  return (0, _lib.readFile)(ourGuy).then(valA => {
    return (0, _inquirer.prompt)(valA).then(answers => {
      return (0, _lib.writeFile)(theirGuy, answers).then(a => a);
    });
  });
});

cli.command('random <outputFile> <fileNames...>', 'Loads a quiz or' + ' multiple quizes and selects a random number of questions from each quiz.' + ' Then, saves the users answers to the given outputFile').action(function (input, callback) {
  let theirGuy = input.outputFile;
  let ourGuy = input.fileNames;
  return Promise.all(ourGuy.map(a => {
    return (0, _lib.readFile)(a);
  })).then(ecks => {
    console.log(ecks);
    ecks = [].concat(...ecks); // flatten questions
    console.log(ecks);
    ecks = (0, _lib.chooseRandom)(ecks, ecks.length); // shuffle questions
    console.log(ecks);
    ecks = (0, _lib.chooseRandom)(ecks); // pick random number of questions
    console.log(ecks);
    return (0, _inquirer.prompt)(ecks).then(answers => {
      return (0, _lib.writeFile)(theirGuy, answers).then(a => a);
    });
  });
  // TODO implement the functionality for taking a random quiz
});

cli.delimiter(cli.chalk['yellow']('quizler>')).show();