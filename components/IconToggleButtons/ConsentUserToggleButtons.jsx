import ToggleButtons from './ToggleButtons'

const ConsentUserToggleButtons = (props) => {
  const buttonsConfig = [
    {
      value: 'consented',
      name: 'С согласием',
      color: 'primary',
    },
    {
      value: 'notConsented',
      name: 'Без согласия',
      color: 'red',
      skipDefaultColorClass: true,
      inactiveClassName: 'text-red-900 border-red-900',
      activeClassName: 'bg-red-900 hover:bg-red-800 border-red-900',
    },
  ]

  return <ToggleButtons {...props} buttonsConfig={buttonsConfig} />
}

export default ConsentUserToggleButtons
