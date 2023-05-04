import { SingleDatepicker } from 'chakra-dayzed-datepicker';

// https://github.com/aboveyunhai/chakra-dayzed-datepicker
export default function DatePicker (props: any) {
  return (
    <SingleDatepicker propsConfigs={{
      dateNavBtnProps: {
        colorScheme: "nemp_yellow",
        variant: "solid",
        color: 'black',
      },
      dayOfMonthBtnProps: {
        defaultBtnProps: {
          borderColor: "nemp_yellow.300",
          _hover: {
            background: 'nemp_yellow.400',
          }
        },
        isInRangeBtnProps: {
          color: "yellow",
        },
        selectedBtnProps: {
          background: "nemp_yellow.500",
          color: "black",
        },
        todayBtnProps: {
          background: "transparent",
        }
      },
      inputProps: {
        size: "sm",
        flex: 3,
        bg: 'white',
      },
      popoverCompProps: {
        popoverContentProps: {
          background: "white",
          color: "black",
        },
      },
    }}
      name="date-input"
      date={props.date}
      onDateChange={props.setDate}
    />
  );
}
