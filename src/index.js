import vorpal from 'vorpal'
import { prompt } from 'inquirer'

import {
  readFile,
  writeFile,
  chooseRandom,
  createPrompt,
  createQuestions
} from './lib'

const cli = vorpal()

const askForQuestions = [
  {
    type: 'input',
    name: 'numQuestions',
    message: 'How many questions do you want in your quiz?',
    validate: input => {
      const pass = input.match(/^[1-9]{1}$|^[1-9]{1}[0-9]{1}$|^100$/)
      return pass ? true : 'Please enter a valid number!'
    }
  },
  {
    type: 'input',
    name: 'numChoices',
    message: 'How many choices should each question have?',
    validate: input => {
      const pass = input.match(/^(?:[2-4]|0[2-4]|4)$/)
      return pass ? true : 'Please enter a valid number!'
    }
  }
]

const createQuiz = title => {
  return prompt(askForQuestions)
    .then(answer => {
      answer['numQuestions'] = parseInt(answer['numQuestions'])
      answer['numChoices'] = parseInt(answer['numChoices'])
      return answer
    })
    .catch(err => console.log('Error creating the quiz.', err))
    .then(ans => {
      return prompt(createPrompt(ans))
    })
    .then(ans => {
      return createQuestions(ans)
    })
    .then(ans => {
      writeFile(title, ans)
    })
}

cli
  .command(
    'create <fileName>',
    'Creates a new quiz and saves it to the given fileName'
  )
  .action(function (input, callback) {
    return createQuiz(input.fileName).then(ans => {})
  })

cli
  .command(
    'take <fileName> <outputFile>',
    'Loads a quiz and saves the users answers to the given outputFile'
  )
  .action(function (input, callback) {
    var ourGuy = input.fileName
    var theirGuy = input.outputFile
    return readFile(ourGuy).then(valA => {
      return prompt(valA).then(answers => {
        return writeFile(theirGuy, answers).then(a => a)
      })
    })
  })

cli
  .command(
    'random <outputFile> <fileNames...>',
    'Loads a quiz or' +
      ' multiple quizes and selects a random number of questions from each quiz.' +
      ' Then, saves the users answers to the given outputFile'
  )
  .action(function (input, callback) {
    let theirGuy = input.outputFile
    let ourGuy = input.fileNames
    return Promise.all(
      ourGuy.map(a => {
        return readFile(a)
      })
    ).then(ecks => {
      ecks = [].concat(...ecks) // flatten questions
      ecks = chooseRandom(ecks, ecks.length) // shuffle questions
      ecks = chooseRandom(ecks) // pick random number of questions
      return prompt(ecks).then(answers => {
        return writeFile(theirGuy, answers).then(a => a)
      })
    })
  })

cli.delimiter(cli.chalk['yellow']('quizler>')).show()
