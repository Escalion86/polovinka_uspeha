import { atom } from 'jotai'
import locationPropsSelector from './locationPropsSelector'
import modeAtom from '@state/atoms/modeAtom'

export const telegramBotNameSelector = atom((get) => {
  const defaultTelegramBotName = get(locationPropsSelector).telegramBotName

  const isDevMode = get(modeAtom) === 'dev'
  const resultTelegramBotName = `${isDevMode ? 'dev_' : ''}${defaultTelegramBotName}`
  return resultTelegramBotName
})

export default telegramBotNameSelector
