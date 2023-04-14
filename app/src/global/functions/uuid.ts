type UUID = `id-${number}`

const uuidGenerator = (function* () {
  let index = 0
  while (true) {
    yield `id-${index++}` satisfies UUID
  }
})()
const generateUuid = (): string => uuidGenerator.next().value

export { generateUuid }
