import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { ruRU } from '@mui/x-date-pickers/locales'
import cn from 'classnames'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import ru from 'dayjs/locale/ru'
import InputWrapper from './InputWrapper'
dayjs.locale(ru)

const TimePicker = ({
  label = '',
  value,
  onChange,
  required = false,
  labelClassName,
  className,
  disabled = false,
  error,
  fullWidth = false,
  noMargin,
}) => {
  return (
    <InputWrapper
      label={label}
      labelClassName={labelClassName}
      value={value}
      className={cn(fullWidth ? '' : 'w-[14.5rem]', className)}
      required={required}
      error={error}
      fullWidth={fullWidth}
      disabled={disabled}
      noMargin={noMargin}
    >
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale={'ru'}
        localeText={
          ruRU.components.MuiLocalizationProvider.defaultProps.localeText
        }
      >
        <DesktopTimePicker
          className="w-[10rem] pl-4"
          sx={{
            boxShadow: 'none',
            '.MuiOutlinedInput-notchedOutline': { borderStyle: 'none' },
            '& .MuiInputBase-root': {
              padding: 0,
              '& .MuiButtonBase-root': {
                padding: 0,
                paddingRight: 3,
                // paddingLeft: 10
              },
              '& .MuiInputBase-input': {
                padding: 0,
                paddingLeft: 1,
              },
            },
            disableUnderline: true,
          }}
          value={value ? dayjs(value) : undefined}
          onChange={onChange}
        />
      </LocalizationProvider>
    </InputWrapper>
  )
}

export default TimePicker
