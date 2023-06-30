const canPrint = (str: string) => process.env.NODE_ENV !== 'production' && str?.length

export const printMsg = (str: string, ...args: any[]) => canPrint(str) && console.log(`[LOG] ${str}`, ...args)
export const printWarning = (str: string, ...args: any[]) => canPrint(str) && console.warn(`[WARN] ${str}`, ...args)
export const printError = (str: string, ...args: any[]) => canPrint(str) && console.error(`[WHOOPSY] ${str}`, ...args)
