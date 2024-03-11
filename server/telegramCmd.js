export const telegramCmd = ['eventSignIn', 'serviceRequest']

export const telegramCmdToIndex = (cmd) => telegramCmd.indexOf(cmd)
export const telegramIndexToCmd = (index) =>
  typeof index === 'number' ? telegramCmd[index] : index
