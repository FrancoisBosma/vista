const canPrint = (str: string) => process.env.NODE_ENV !== 'production' && str?.length

export const printMsg = (str: string) => canPrint(str) && console.log(`[LOG] ${str}`)
export const printWarning = (str: string) => canPrint(str) && console.warn(`[WHOOPSY] ${str}`)
export const printError = (str: string) => canPrint(str) && console.error(`[WHOOPSY] ${str}`)
