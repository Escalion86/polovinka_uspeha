import formatDate from '@helpers/formatDate'
import { DatePicker as MUIDatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { ruRU } from '@mui/x-date-pickers/locales'
import cn from 'classnames'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import ru from 'dayjs/locale/ru'
import InputWrapper from './InputWrapper'
dayjs.locale(ru)

const DatePicker = ({
  label = '',
  name,
  value,
  onChange,
  required = false,
  labelClassName,
  className,
  disabled = false,
  showYears = false,
  showZodiac = false,
  error,
  fullWidth,
  defaultValue,
  noMargin,
}) => {
  return (
    <InputWrapper
      label={label}
      labelClassName={labelClassName}
      value={value}
      className={cn(fullWidth ? '' : 'w-48', className)}
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
        {/* <FormControl sx={{ m: 1, width: 300 }} size="small" margin="none"> */}
        <MUIDatePicker
          className="border-0 ring-0 outline-hidden"
          // disableFuture
          // label={label}
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
          // renderInput={(params) => <input {...params} />}
          openTo="year"
          views={['year', 'month', 'day']}
          // value={dayjs(value)}
          value={value ? dayjs(formatDate(value, true)) : undefined}
          defaultValue={
            defaultValue ? dayjs(formatDate(defaultValue, true)) : undefined
          }
          disabled={disabled}
          onChange={onChange}
          // slotProps={{
          //   // textField: {
          //   //   // helperText: 'дд.мм.гггг',
          //   //   style: { padding: 0 },
          //   // },
          //   textField: {
          //     InputProps: {
          //       style: { padding: 0 },
          //       // startAdornment: (
          //       //   <InputAdornment position="start">
          //       //    ...
          //       //   </InputAdornment>
          //       // ),
          //     },
          //   },
          // }}
          // slots={{
          //   textField: (params) => (
          //     <TextField
          //       sx={{ p: 0 }}
          //       size="small"
          //       margin="none"
          //       {...params}
          //       // inputProps={{
          //       //   style: {
          //       //     padding: 0,
          //       //   },
          //       // }}
          //     />
          //   ),
          // }}
          // renderInput={(params) => (
          //   <TextField
          //     // sx={{ m: 6 }}
          //     slo
          //     // inputProps={{
          //     //   style: {
          //     //     padding: 0,
          //     //   },
          //     // }}
          //     fullWidth
          //     size="small"
          //     margin="none"
          //     {...params}
          //   />
          // )}
          // maxDate={undefined}
          // minDate={new Date()}
        />
        {/* </FormControl> */}
      </LocalizationProvider>
    </InputWrapper>
  )
}

export default DatePicker
