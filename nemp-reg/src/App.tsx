import { Box, Center, Flex, Container, VStack, Input, Button } from "@chakra-ui/react"
import Footer from "./components/Footer"
import RegistrationForm from "./screens/RegistrationForm"
import { useEffect, useState } from "react"
import VerifySMSCode from "./screens/VerifySmsCode"
import Thanks from "./screens/Thanks"
import SendSMSVerification from "./screens/SendSmsVerification"

export interface userDataIF {
  verified: boolean,
  complete: boolean,
  countryCode: string | null,
  phone: string | null,
  optId: string | null,
  domain: string | null,
  gender: string | null,
  firstName: string | null,
  lastName: string | null,
  username: string | null,
  password: string | null,
}

export interface UserDataProps {
  userData: userDataIF;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
}

const userDataInit: userDataIF = {
  verified: false,
  complete: false,
  countryCode: null,
  phone: null,
  optId: null,
  domain: null,
  gender: null,
  firstName: null,
  lastName: null,
  username: null,
  password: null,
}

function loadOptIdFromUrl() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get('optid');
}

function App (): JSX.Element {
  const [ userData, setUserData ] = useState({
    ...userDataInit,
    optId: loadOptIdFromUrl(),
  });

  function getScreen() {
    console.log(`[debug] screen changed`);

    // return <RegistrationForm userData={userData} setUserData={setUserData} />

    switch(true) {
      case (userData.complete):
        return <Thanks userData={userData} setUserData={setUserData} />
      case (!userData.optId):
        return <SendSMSVerification userData={userData} setUserData={setUserData} />
      case (userData.optId && !userData.verified):
        return <VerifySMSCode userData={userData} setUserData={setUserData} />
      case (userData.optId && userData.verified && !userData.complete):
        return <RegistrationForm userData={userData} setUserData={setUserData} />
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
