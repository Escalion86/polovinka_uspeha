import formatDate from '@helpers/formatDate'
import birthDateToAge from '@helpers/birthDateToAge'
import cn from 'classnames'
import getZodiac from '@helpers/getZodiac'
import InputWrapper from './InputWrapper'
import 'dayjs/locale/ru'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TextField } from '@mui/material'

const DatePicker2 = ({
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
    // <InputWrapper
    //   label={label}
    //   labelClassName={labelClassName}
    //   onChange={onChange}
    //   copyPasteButtons={false}
    //   value={value}
    //   className={cn(fullWidth ? '' : 'w-48', className)}
    //   required={required}
    //   error={error}
    //   // postfix={
    //   //   value &&
    //   //   (showYears || showZodiac) &&
    //   //   '(' +
    //   //     (showYears ? birthDateToAge(value) : '') +
    //   //     (showYears && showZodiac ? ', ' : '') +
    //   //     (showZodiac ? getZodiac(value).name : '') +
    //   //     ')'
    //   // }
    //   fullWidth={fullWidth}
    //   paddingY="small"
    //   disabled={disabled}
    //   noMargin={noMargin}
    // >
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'ru'}>
      {/* <FormControl sx={{ m: 1, width: 300 }} size="small" margin="none"> */}
      <DatePicker
        // disableFuture
        label={label}
        // renderInput={(params) => <TextField variant="standard" {...params} />}
        openTo="year"
        views={['year', 'month', 'day']}
        value={value}
        onChange={onChange}
        // renderInput={(params) => (
        //   <TextField
        //     sx={{ m: 1 }}
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
    // </InputWrapper>
  )
}

export default DatePicker2
