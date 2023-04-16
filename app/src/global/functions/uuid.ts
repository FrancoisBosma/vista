export type UUID = `uuid-${number}`

const uuidGenerator = (function* () {
  let index = 0
  while (true) {
    yield `uuid-${index++}` satisfies UUID
  }
})()
const generateUuid = () => uuidGenerator.next().value

export { generateUuid }
