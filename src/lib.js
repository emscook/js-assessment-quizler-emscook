// import { readFile, writeFile } from 'fs'
import { readFile as fsReadFile, writeFile as fsWriteFile } from 'fs'
// TODO copy your readFile, writeFile, chooseRandom, createPrompt, and createQuestions
// functions from your assignments.
const chooseRandom = (array = [], numItems = 0) => {
  return array.length <= 1 || numItems < 0
    ? array
    : Array(
        numItems > array.length || numItems === 0
          ? Math.floor(Math.random() * array.length) + 1
          : numItems
      )
        .fill()
        .reduce(
          res =>
            res.concat(
              Array.apply(null, { length: array.length })
                .map(Number.call, Number)
                .filter(vally => res.indexOf(vally) < 0)[
                Math.floor(Math.random() * (array.length - res.length) * 2) %
                  (array.length - res.length)
              ]
            ),
          []
        )
        .map(currVal => array[currVal])
} // numQuestions
// numQuestions
// TODO copy createPrompt() from previous assignment
const createPrompt = ({ numQuestions = 1, numChoices = 2 } = {}) => {
  return Array(numQuestions + numQuestions * numChoices)
    .fill()
    .map((res, i) => generateEntry(i, numChoices))
}
// The following helper methods must be rewritten if more entry types are added.
const generateEntry = (i, numChoices) =>
  (isQuestionEntry(i, numChoices)
    ? createEntry(
        'input',
        `question-${entryToQuestionNumber(i, numChoices)}`,
        `Enter question ${entryToQuestionNumber(i, numChoices)}`
      )
    : createEntry(
        'input',
        `question-${entryToQuestionNumber(i, numChoices)}-choice-${entryToChoiceNumber(i, numChoices)}`,
        `Enter answer choice ${entryToChoiceNumber(i, numChoices)} for question ${entryToQuestionNumber(i, numChoices)}`
      ))
const isQuestionEntry = (i, numChoices) => i % (1 + numChoices) === 0
const createEntry = (typeIn, nameIn, messageIn) => ({
  type: typeIn,
  name: nameIn,
  message: messageIn
})

const entryToQuestionNumber = (i, numChoices) =>
  Math.floor(i / (numChoices + 1)) + 1

const entryToChoiceNumber = (i, numChoices) => i % (numChoices + 1)

const createQuestions = (inputQuestions = {}) => {
  return Object.values(
    Object.keys(inputQuestions)
      .concat()
      .sort((a, b) => a.length - b.length || a.localeCompare(b))
      .reduce((res, entryTitle) => {
        entryTitle.split('-').length === 2
          ? (res[entryTitle.split('-')[1]] = {
            type: 'list',
            name: entryTitle,
            message: inputQuestions[entryTitle],
            choices: []
          })
          : res[entryTitle.split('-')[1]]['choices'].push(
              inputQuestions[entryTitle]
            )
        return res
      }, {})
  )
}
const readFile = fileName =>
  new Promise((resolve, reject) =>
    fsReadFile(
      `${fileName}.json`,
      (err, data) => (err ? reject(Error(err)) : resolve(JSON.parse(data)))
    )
  )
const writeFile = (fileName, data) =>
  new Promise((resolve, reject) =>
    fsWriteFile(
      `${fileName}.json`,
      JSON.stringify(data),
      err => (err ? reject(Error(err)) : resolve('File saved successfully'))
    )
  )
// TODO export your functions
export { chooseRandom, createPrompt, createQuestions, readFile, writeFile }
