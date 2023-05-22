import { VStack, Input, Button, Text } from "@chakra-ui/react";
import BoxHeader from "../components/BoxHeader";
import { UserDataProps } from "../App";
import { useEffect, useState } from "react";
import ErrorsDisplay from "../components/Errors";
import { apiVerifySMSCode } from "../api/api";
import { removeOptIdFromUrl } from "../utils/urlParams";


export default function VerifySMSCode (props: UserDataProps): JSX.Element {
  const { userData, setUserData } = props;
  const [smsCode, setSMSCode] = useState('');
  const errorsArray: string[] = [];
  const [errors, setErrors] = useState(errorsArray);
  const [loading, setLoading] = useState(false);
  const [resentTimeout, setResentTimeout] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setResentTimeout((resentTimeout) => {
        if (resentTimeout <= 0) {
          clearInterval(interval);
        }

        return resentTimeout - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  function resent() {
    setUserData({
      ...userData,
      optId: null,
    });
  }

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
        removeOptIdFromUrl();
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
        <Text fontSize={'sm'} as="b" mb="2" color="nemp_yellow.600">{userData.countryCode} {userData.phone}</Text>
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
        <Text mb={'2'} fontSize={'sm'} >Didn't you get a sms code?</Text>
        <Button 
          isDisabled={resentTimeout > 0 ? true : false} 
          size={'xs'} 
          color="default"
          onClick={resent}
        >
          Resent SMS code {resentTimeout > 0 ? `${resentTimeout}s` : ''}
        </Button>
      </VStack>
    </>
  )
}
