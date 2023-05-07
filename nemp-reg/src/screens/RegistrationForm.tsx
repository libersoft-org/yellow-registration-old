import { Center, Flex, VStack, Input, Select, Text, Button } from "@chakra-ui/react"
import CountryCodesSelect from "../components/CountryCodesSelect"
import BoxHeader from "../components/BoxHeader"
import { useState } from "react"
import DatePicker from "../components/DatePicker"
import { UserDataProps } from "../App"

export default function RegistrationForm (props: UserDataProps): JSX.Element {
  const [date, setDate] = useState(new Date());
  const [inputs, setInput] = useState({
    username: '',
    domain: ''
  });

  function selectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const {name, value} = e.currentTarget;
    console.log(name, value);
    if (Object.keys(inputs).includes(name)) {
      const update = {
        ...inputs,
        [name]: value
      }
      setInput(update);
    }
  }

  function inputChange(e: React.ChangeEvent<HTMLInputElement> ) {
    const {name, value} = e.currentTarget;
    console.log(name, value);
    if (Object.keys(inputs).includes(name)) {
      const update = {
        ...inputs,
        [name]: value
      }
      setInput(update);
    }
  }

  return (
    <>
      <BoxHeader title="Create your free NEMP account" />
      <VStack>
        <Flex width={'100%'}>
          <Input name="username" onChange={inputChange} value={inputs.username} placeholder="user name" size='sm' flex={3} mr={2} bg={'white'} />
          <Select name="domain" onChange={selectChange} value={inputs.domain} placeholder='domain' size='sm' flex={2} bg={'white'}>
            <option value='nemp.io'>nemp.io</option>
          </Select>
        </Flex>
        <Input name="firstName" placeholder="first name" size='sm' bg={'white'} />
        <Input name="lastName" placeholder="last name" size='sm' bg={'white'} />
        <Select name="domain" onChange={selectChange} value={inputs.domain} placeholder='gender' size='sm' bg={'white'}>
          <option value='female'>♀️ female</option>
          <option value='male'>♂️ male</option>
        </Select>
        <Flex width={'100%'}>
          <Center width={'100%'}>
            <Text fontSize='sm' textAlign={'center'} flex={2} >birth date</Text>
            <DatePicker name="birthDate" date={date} setDate={setDate} />
          </Center>
        </Flex>
        <Input name="password" placeholder="password" size='sm' bg={'white'} />
        <Input name="passwordAgain" placeholder="password again" size='sm' bg={'white'} />
      </VStack>
      <Button w='100%' mt={10} colorScheme="nemp_yellow" color={'black'}>
        Finish registration
      </Button>
    </>
  )
}
