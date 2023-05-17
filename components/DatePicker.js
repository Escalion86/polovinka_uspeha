import formatDate from '@helpers/formatDate'
import birthDateToAge from '@helpers/birthDateToAge'
import cn from 'classnames'
import getZodiac from '@helpers/getZodiac'
import InputWrapper from './InputWrapper'
import 'dayjs/locale/ru'
import dayjs from 'dayjs'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker as MUIDatePicker } from '@mui/x-date-pickers/DatePicker'

const DatePicker = ({
  label = '',
  name,
  value,
  onChange,
  required = false,
  labelClassName,
  // wrapperClassName,
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
      onChange={onChange}
      copyPasteButtons={false}
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
      noMargin={noMargin}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'ru'}>
        {/* <FormControl sx={{ m: 1, width: 300 }} size="small" margin="none"> */}
        <MUIDatePicker
          // disableFuture
          // label={label}
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
          // renderInput={(params) => <input {...params} />}
          openTo="year"
          views={['year', 'month', 'day']}
          // value={dayjs(value)}
          value={value ? dayjs(formatDate(value, true)) : undefined}
          defaultValue={
            defaultValue ? dayjs(formatDate(defaultValue, true)) : undefined
          }
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
