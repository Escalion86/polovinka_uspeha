import { useWindowDimensionsTailwindNum } from '@helpers/useWindowDimensions'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { DateTimePicker as MUIDateTimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { ruRU } from '@mui/x-date-pickers/locales'
import cn from 'classnames'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import ru from 'dayjs/locale/ru'
import InputWrapper from './InputWrapper'

dayjs.locale(ru)

const DateTimePicker = ({
  label = '',
  value,
  onChange,
  required = false,
  labelClassName,
  className,
  disabled = false,
  error,
  fullWidth = false,
  defaultValue,
  noMargin,
  startWithYear = false,
}) => {
  const widthNum = useWindowDimensionsTailwindNum()
  return (
    <InputWrapper
      label={label}
      labelClassName={labelClassName}
      value={value}
      className={cn(
        fullWidth ? '' : widthNum <= 2 ? 'w-[12rem]' : 'w-58',
        className
      )}
      required={required}
      error={error}
      // postfix={
      //   value &&
      //   (showYears || showZodiac) &&
      //   '(' +
      //     (showYears ? birthDateToAge(value) : '') +
      //     (showYears && showZodiac ? ', ' : '') +
      //     (showZodiac ? getZodiac(value).name : '') +
      //     ')'
      // }
      fullWidth={fullWidth}
      // paddingY="small"
      disabled={disabled}
      showDisabledIcon={false}
      noMargin={noMargin}
    >
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale={'ru'}
        localeText={
          ruRU.components.MuiLocalizationProvider.defaultProps.localeText
        }
      >
        <MUIDateTimePicker
          sx={{
            boxShadow: 'none',
            '.MuiOutlinedInput-notchedOutline': {
              borderStyle: 'none',
              outline: 'none',
            },
            '.MuiPickersOutlinedInput-notchedOutline': {
              borderStyle: 'none',
              outline: 'none',
            },
            '.MuiPickersOutlinedInput-root': {
              borderStyle: 'none',
              padding: 0,
            },
            '.MuiPickersSectionList-root': {
              padding: 1,
              borderStyle: 'none',
            },
            '.MuiInputAdornment-root': {
              marginLeft: -2,
              marginRight: 2,
            },
            '& .MuiInputBase-root': {
              padding: 0,
              '& .MuiButtonBase-root': {
                padding: 0,
                // paddingRight: 3,
                // paddingLeft: 10
              },
              '& .MuiInputBase-input': {
                padding: 0,
                // paddingLeft: 1,
              },
              '& .MuiPickersInputBase-root': {
                padding: 0,
                border: 'none',
                boxShadow: 'none',
                '& .MuiPickersSectionList-root': {
                  padding: 0,
                },
              },
              '& .MuiPickersOutlinedInput-root': {
                padding: 0,
                border: 'none',
              },
            },
            disableUnderline: true,
          }}
          inputFormat={widthNum <= 2 ? 'dd.MM.yyyy HH:mm' : 'dd.MM.yyyy'}
          openTo={startWithYear ? 'year' : 'day'}
          views={
            widthNum <= 2
              ? ['year', 'month', 'day', 'hours', 'minutes']
              : ['year', 'month', 'day']
          }
          value={value === null ? null : value ? dayjs(value) : undefined}
          defaultValue={defaultValue ? dayjs(defaultValue) : undefined}
          onChange={(date) => onChange(date.toISOString())}
          disabled={disabled}
          showDisabledIcon={false}
          slotProps={{
            textField: {
              // sx: { outline: 'none' },
              // disableUnderline: true,
              // outlined: false,
              // size: 'small',
              // paddingX: 0,
              // sx: { paddingX: 0, padding: 0 },
              // margin: 0,
            },
            // layout: {
            //   sx: { padding: 0, margin: 0, p: 0, px: 0 },
            //   slotProps: {
            //     root: { sx: { padding: 0, margin: 0, p: 0, px: 0 } },
            //   },
            // },
          }}
        />
        {widthNum > 2 && (
          <MUIDateTimePicker
            className="w-[10rem] pl-4"
            sx={{
              boxShadow: 'none',
              '.MuiOutlinedInput-notchedOutline': {
                borderStyle: 'none',
                outline: 'none',
              },
              '.MuiPickersOutlinedInput-notchedOutline': {
                borderStyle: 'none',
                outline: 'none',
              },
              '.MuiPickersOutlinedInput-root': {
                borderStyle: 'none',
                marginLeft: 2,
                padding: 0,
              },
              '.MuiPickersSectionList-root': {
                padding: 1,

                borderStyle: 'none',
              },
              '.MuiInputAdornment-root': {
                marginLeft: -2,
                marginRight: 2,
              },
              '& .MuiInputBase-root': {
                padding: 0,
                '& .MuiButtonBase-root': {
                  padding: 0,
                  // paddingRight: 3,
                  // paddingLeft: 10
                },
                '& .MuiInputBase-input': {
                  padding: 0,
                  // paddingLeft: 1,
                },
                '& .MuiPickersInputBase-root': {
                  padding: 0,
                  border: 'none',
                  boxShadow: 'none',
                  '& .MuiPickersSectionList-root': {
                    padding: 0,
                  },
                },
                '& .MuiPickersOutlinedInput-root': {
                  padding: 0,
                  border: 'none',
                },
              },
              disableUnderline: true,
            }}
            inputFormat="HH:mm"
            openTo="hours"
            views={['hours', 'minutes']}
            value={value === null ? null : value ? dayjs(value) : undefined}
            defaultValue={defaultValue ? dayjs(defaultValue) : undefined}
            slots={{
              openPickerIcon: AccessTimeIcon,
            }}
            onChange={(date) => onChange(date.toISOString())}
            disabled={disabled}
            showDisabledIcon={false}
          />
        )}
      </LocalizationProvider>
    </InputWrapper>
  )
}

export default DateTimePicker
