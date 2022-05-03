import formatDate from '@helpers/formatDate'
import birthDateToAge from '@helpers/birthDateToAge'
import cn from 'classnames'
import getZodiac from '@helpers/getZodiac'

const DatePicker = ({
  label = '',
  name,
  value,
  onChange,
  required = false,
  className,
  disabled = false,
  inLine = false,
  showYears = false,
  showZodiac = false,
}) => {
  return (
    <>
      <label
        className="flex items-center justify-end leading-4 text-right"
        htmlFor={name}
      >
        {label}
        {required && <span className="text-red-700">*</span>}
      </label>
      <div className="flex items-center">
        <input
          className={cn(
            'text-input px-1 border max-w-40 rounded outline-none focus:shadow-active',
            required && !value ? ' border-red-700' : ' border-gray-400',
            { 'bg-gray-200  text-disabled': disabled }
          )}
          type="date"
          name={name}
          defaultValue={formatDate(value, true)}
          onChange={(e) => {
            const value = e.target.value
            var year = value.substring(0, 4)
            var month = value.substring(5, 7)
            var day = value.substring(8, 10)

            onChange(new Date(year, month - 1, day).toISOString())
          }}
          pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
          // min="2018-01-01"
          // max="2018-12-31"
        />
        {value && (showYears || showZodiac) && (
          <div className="ml-2 whitespace-nowrap">
            {'(' +
              (showYears ? birthDateToAge(value) : '') +
              (showYears && showZodiac ? ', ' : '') +
              (showZodiac ? getZodiac(value).name : '') +
              ')'}
          </div>
        )}
      </div>
    </>
  )
}

export default DatePicker
