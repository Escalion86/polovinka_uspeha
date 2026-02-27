const CARD_BUTTON_PALETTE = {
  blue: {
    text: 'text-[#1e4fa3]',
    hover: 'hover:bg-[#1e4fa3] hover:text-white',
    active: 'bg-[#1e4fa3] text-white',
  },
  green: {
    // Legacy key "green" intentionally mapped to orange for unified edit actions.
    text: 'text-[#c26a00]',
    hover: 'hover:bg-[#c26a00] hover:text-white',
    active: 'bg-[#c26a00] text-white',
  },
  orange: {
    text: 'text-[#c26a00]',
    hover: 'hover:bg-[#c26a00] hover:text-white',
    active: 'bg-[#c26a00] text-white',
  },
  red: {
    text: 'text-[#b42318]',
    hover: 'hover:bg-[#b42318] hover:text-white',
    active: 'bg-[#b42318] text-white',
  },
  purple: {
    text: 'text-[#7b4fb3]',
    hover: 'hover:bg-[#7b4fb3] hover:text-white',
    active: 'bg-[#7b4fb3] text-white',
  },
  general: {
    text: 'text-[#6b1f2a]',
    hover: 'hover:bg-[#6b1f2a] hover:text-white',
    active: 'bg-[#6b1f2a] text-white',
  },
}

export const getCardButtonPalette = (color) =>
  CARD_BUTTON_PALETTE[color] || CARD_BUTTON_PALETTE.general
