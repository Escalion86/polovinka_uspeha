import cn from 'classnames'

const QuestionnaireAnswersFill = ({
  answers,
  questionnaireData = [],
  small,
}) => {
  console.log('answers', answers)
  var hiddenKeys = []
  const filteredQuestionnaireData = questionnaireData.filter((item) => {
    if (item.show) return true
    hiddenKeys.push(item.key)
    return false
  })
  if (!answers || filteredQuestionnaireData.length === 0) return null
  const filteredAnswers = { ...answers }
  hiddenKeys.forEach((key) => delete filteredAnswers[key])

  const percent = Math.round(
    (Object.values(filteredAnswers).filter(
      (value) =>
        value !== undefined &&
        value !== null &&
        value !== 'NaN' &&
        (!typeof value == 'object' || value.length !== 0)
    ).length /
      filteredQuestionnaireData.length) *
      100
  )
  return (
    <div className={cn(small ? 'w-9 h-9' : 'w-10 h-10')}>
      <svg viewBox="0 0 36 36" className="stroke-general">
        <path
          className="fill-none stroke-gray-200"
          d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
          strokeWidth={3.8}
        />
        <path
          className="fill-none"
          strokeDasharray={`${percent}, 100`}
          strokeWidth={3.8}
          strokeLinecap="round"
          d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
          style={{ animation: 'progress 1s ease-out forwards' }}
        />
        <text
          x="18"
          y="21.7"
          className="font-thin stroke-black"
          textAnchor="middle"
          fontSize="0.67em"
        >
          {`${percent}%`}
        </text>
      </svg>
    </div>
  )
}

export default QuestionnaireAnswersFill
