import { Center, Container, HStack, Select, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
// import { SingleDatepicker } from 'chakra-dayzed-datepicker';
// https://github.com/aboveyunhai/chakra-dayzed-datepicker

export default function BirthDateInputs (props: any) {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  useEffect(() => {
    if (day && month && year) {
      const dateFormat = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      props.setDate(dateFormat);
    }
  }, [day, month, year]);

  return (
    <Container width={'100%'} p={0}>
      <Center mb={2}>
        <Text fontSize={'sm'}>🎂 birth date</Text>
      </Center>
      <HStack width={'100%'}>
        <Select name="day" size='sm' bg={'white'} placeholder='day' onChange={(e) => setDay(e.currentTarget.value)} value={day}>
          {[...Array(32).keys()].map((day) => {
            if (day === 0) return;
            return <option key={`d-${day}`} value={day}>{day}.</option>
          })}
        </Select>
        <Select name="month" size='sm' bg={'white'} placeholder='month' onChange={(e) => setMonth(e.currentTarget.value)} value={month}>
          {[...Array(13).keys()].map((month) => {
            if (month === 0) return;
            return <option key={`m-${month}`} value={month}>{month}.</option>
          })}
        </Select>
        <Select name="year" size='sm' bg={'white'} placeholder='year' onChange={(e) => setYear(e.currentTarget.value)} value={year}>
          {[...Array(60).keys()].map((year) => {
            if (year === 0) return;
            const yearFull = (new Date().getFullYear() - year)
            return <option key={`y-${year}`} value={yearFull}>{yearFull}</option>
          })}
        </Select>
      </HStack>
    </Container>
  )
}
