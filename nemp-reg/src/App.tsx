import { Box, Center, Flex, Container, VStack} from "@chakra-ui/react"
import Footer from "./components/Footer"
import UserForm from "./screens/UserForm"
import { useState } from "react"
import VerifySMSCode from "./screens/VerifySMSCode"
import Thanks from "./screens/Thanks"
import PhoneVerification from "./screens/PhoneVerification"
import { loadOptIdFromUrl } from "./utils/urlParams"

export interface userDataIF {
  verified: boolean,
  complete: boolean,
  countryCode: string | null,
  phone: string | null,
  optId: string | null,
  domain: string | null,
  gender: string | null,
  firstname: string | null,
  lastname: string | null,
  username: string | null,
  password: string | null,
}

export interface UserDataProps {
  userData: userDataIF;
  setUserData: React.Dispatch<React.SetStateAction<userDataIF>>;
}

const userDataInit: userDataIF = {
  verified: false,
  complete: false,
  countryCode: null,
  phone: null,
  optId: null,
  domain: null,
  gender: null,
  firstname: null,
  lastname: null,
  username: null,
  password: null,
}

function App (): JSX.Element {
  const [ userData, setUserData ] = useState({
    ...userDataInit,
    optId: loadOptIdFromUrl(),
  });

  function getScreen() {
    switch(true) {
      case (userData.complete):
        return <Thanks />
      case (!userData.optId):
        return <PhoneVerification userData={userData} setUserData={setUserData} />
      case (userData.optId && !userData.verified):
        return <VerifySMSCode userData={userData} setUserData={setUserData} />
      case (userData.optId && userData.verified && !userData.complete):
        return <UserForm userData={userData} setUserData={setUserData} />
    }
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
            {getScreen()}
          </Box>
        </VStack>
      </Center>
    </Container>
    <Footer />
  </Flex>
  )
}

export default App
