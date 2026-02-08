import CardButtons from '@components/CardButtons'

const ScheduledMessageCardButtons = ({ buttons, isCompact = true }) => {
  return <CardButtons buttons={buttons} alwaysCompact={isCompact} />
}

export default ScheduledMessageCardButtons
