import { Box, Center, Flex, Container, VStack, Input, Button } from "@chakra-ui/react"
import Footer from "./components/Footer"
import RegistrationForm from "./screens/RegistrationForm"
import CountryCodesSelect from "./components/CountryCodesSelect"
import BoxHeader from "./components/BoxHeader"
import SendSMSVerification from "./screens/SendSmsVerification"

//             <RegistrationForm /> <SMSVerification />

function App (): JSX.Element {
  const [phone, setPhone] = useState('');

  function sendVerificationSMSDone(phone: string, optId: string) {

  }

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
            <SendSMSVerification />
          </Box>
        </VStack>
      </Center>
    </Container>
    <Footer />
  </Flex>
  )
}

export default App
