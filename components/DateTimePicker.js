import cn from 'classnames'
import InputWrapper from './InputWrapper'
import 'dayjs/locale/ru'
import dayjs from 'dayjs'
import ru from 'dayjs/locale/ru'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
dayjs.locale(ru)

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import {
  DateTimePicker as MUIDateTimePicker,
  // MobileDateTimePicker,
} from '@mui/x-date-pickers'
import { ruRU } from '@mui/x-date-pickers/locales'
import { useWindowDimensionsTailwindNum } from '@helpers/useWindowDimensions'

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
      onChange={onChange}
      copyPasteButtons={false}
      value={value}
      className={cn(fullWidth ? '' : 'w-[14.5rem]', className)}
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
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale={'ru'}
        localeText={
          ruRU.components.MuiLocalizationProvider.defaultProps.localeText
        }
      >
        {/* <FormControl sx={{ m: 1, width: 300 }} size="small" margin="none"> */}
        <MUIDateTimePicker
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
          inputFormat={widthNum <= 2 ? 'dd.MM.yyyy HH:mm' : 'dd.MM.yyyy'}
          // renderInput={(params) => <TextField {...params} />}
          // renderInput={(params) => <input {...params} />}
          openTo={startWithYear ? 'year' : 'day'}
          views={
            widthNum <= 2
              ? ['year', 'month', 'day', 'hours', 'minutes']
              : ['year', 'month', 'day']
          }
          // views={['hours', 'minutes']}
          // value={dayjs(value)}
          value={value ? dayjs(value) : undefined}
          defaultValue={defaultValue ? dayjs(defaultValue) : undefined}
          // slots={{
          //   switchViewIcon
          // }}
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
        {widthNum > 2 && (
          <MUIDateTimePicker
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
            inputFormat="HH:mm"
            openTo="hours"
            views={['hours', 'minutes']}
            value={value ? dayjs(value) : undefined}
            defaultValue={defaultValue ? dayjs(defaultValue) : undefined}
            slots={{
              openPickerIcon: AccessTimeIcon,
            }}
            onChange={onChange}
          />
        )}
      </LocalizationProvider>
    </InputWrapper>
  )
}

export default DateTimePicker
