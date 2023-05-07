import { VStack, Input, Button, Text } from "@chakra-ui/react";
import BoxHeader from "../components/BoxHeader";
import { UserDataProps } from "../App";
import { useState } from "react";
import ErrorsDisplay from "../components/Errors";
import { apiVerifySMSCode } from "../api/api";



export default function VerifySMSCode (props: UserDataProps): JSX.Element {
  const { userData, setUserData } = props;
  const [smsCode, setSMSCode] = useState('');
  const errorsArray: string[] = [];
  const [errors, setErrors] = useState(errorsArray);
  const [loading, setLoading] = useState(false);
  const [resentDisabled, setResentDisabled] = useState(true);
  
  async function verifySMSCode() {
    if (smsCode.length < 6) {
      setErrors(['not accepted verification code']);
      return;
    }

    if (userData.optId) {
      setLoading(true);
      await apiVerifySMSCode(userData.optId, smsCode).then((response) => {
        if (response.errors) {
          setErrors(response.errors);
          return;
        }
        setErrors([]);
        setSMSCode('');
        setUserData({
          ...userData,
          verified: true,
        });
      }).catch((error) => {
        if (error.message) {
          setErrors([error.message]);
        }
      });
      setLoading(false);
    } else {
      setErrors(['Verification id not found']);
      return;
    }
  }

  return (
    <>
      <BoxHeader title="Verify your NEPM registration" />
      {errors && ErrorsDisplay(errors)}
      <VStack>
        <Text fontSize={'sm'} as="b" mb="2" color="nemp_yellow.600">{userData.phone}</Text>
        <Input 
          onChange={(e:React.ChangeEvent<HTMLInputElement>) => { setSMSCode(e.currentTarget.value)}} 
          value={smsCode}
          placeholder="SMS Code"
          maxW={'150px'} size='sm' bg={'white'} />
      </VStack>
      <Button 
        onClick={verifySMSCode} 
        isLoading={loading}
        loadingText='Verification in progress'
        w='100%' mt={10} colorScheme="nemp_yellow" color={'black'}>
        Verify code
      </Button>
      <VStack mt={'5'}>
        <Text fontSize={'sm'} >Didn't you get a sms code?</Text>
        <Button isDisabled={resentDisabled} size={'xs'} color="default">
          Resent SMS code
        </Button>
      </VStack>
      
    </>
  )
}
