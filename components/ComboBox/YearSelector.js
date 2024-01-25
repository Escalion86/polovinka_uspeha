import ComboBox from '@components/ComboBox'

const YearSelector = ({ onChange, year, years = [2022, 2023, 2024] }) => {
  const items = years.map((year) => ({
    value: Number(year),
    name: String(year),
  }))
  return (
    <ComboBox
      label="Год"
      className="max-w-30"
      items={items}
      value={year}
      onChange={(value) => onChange(Number(value))}
    />
  )
}

export default YearSelector
