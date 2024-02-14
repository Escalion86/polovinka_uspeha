const Ages = ({ minAge, maxAge }) => (
  <div className="flex justify-center gap-x-0.5 border-b self-stretch">
    <span>{minAge ?? 18}</span>
    <span>-</span>
    <span>{maxAge ?? 60}</span>
    <span>лет</span>
  </div>
)

export default Ages
