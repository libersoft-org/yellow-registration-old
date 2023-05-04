import { Box, Center, Flex, Container, VStack, FormControl, HStack, Input, Select, Text, Button } from "@chakra-ui/react"
import Footer from "./components/Footer"
import BoxHeader from "./components/BoxHeader"
import CountryCodesSelect from "./components/CountryCodesSelect"
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { useState } from "react";
import DatePicker from "./components/DatePicker";

function App (): JSX.Element {
  const [date, setDate] = useState(new Date());

  return (
    <Flex
    minW="100vw"
    minH="100vh"
    p={3}
    justify="space-between"
    align="center"
    direction="column"
  >
    <div></div>
    <Container>
      <Center>
        <VStack>
          <Box bg="nemp_yellow.50" w="380px" boxShadow="lg" p="5" borderRadius="md">
            <BoxHeader title="Create your free NEMP account" />
            <VStack>
              <Flex width={'100%'}>
                <Input placeholder="user name" size='sm' flex={3} mr={2} bg={'white'} />
                <Select placeholder='domain' size='sm' flex={2} bg={'white'}>
                  <option value='option1'>nemp.io</option>
                </Select>
              </Flex>
              <Input placeholder="first name" size='sm' bg={'white'} />
              <Input placeholder="last name" size='sm' bg={'white'} />
              <Flex width={'100%'}>
                <Center width={'100%'}>
                <Text fontSize='sm' textAlign={'center'} flex={2} >birth date</Text>
                <DatePicker date={date} setDate={setDate} />
                </Center>
              </Flex>
              <Flex width={'100%'}>
                <CountryCodesSelect placeholder="country" flex={2} size='sm' mr={2} bg='white' />
                <Input type="text" placeholder="phone number" flex={3} size='sm' bg='white' />
              </Flex>
              <Input placeholder="password" size='sm' bg={'white'} />
              <Input placeholder="password again" size='sm' bg={'white'} />
            </VStack>
            <Button w='100%' mt={10} colorScheme="nemp_yellow" color={'black'}>
              Continue
            </Button>
          </Box>
        </VStack>
      </Center>
    </Container>
    <Footer />
  </Flex>
  )
}

export default App
