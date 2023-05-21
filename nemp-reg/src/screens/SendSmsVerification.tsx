import { VStack, Flex, Input, Button, Container, Text, Stack, Badge } from "@chakra-ui/react";
import BoxHeader from "../components/BoxHeader";
import CountryCodesSelect from "../components/CountryCodesSelect";
import { useState } from "react";
import { validate } from "validate.js";
import { apiSendVerificationSMS } from "../api/api";
import { WarningTwoIcon } from "@chakra-ui/icons";
import { UserDataProps } from "../App";
import ErrorsDisplay from "../components/Errors";

const constraints = {
  countryCode: {
    presence: {allowEmpty: false},
  },
  phoneNumber: {
    presence: true,
    format: {
      pattern: /\d{1}[0-9]\d{3,14}/,
      flags: 'i',
      message: 'not valid',
    },
  },
};

function storeOptIdInURL(optId: string) {
  const url = new URL(window.location.href);
  url.searchParams.set("optid", optId);
  history.pushState({}, "", url);
}

export default function SendSMSVerification(props: UserDataProps) {

  const { userData, setUserData } = props;

  const [countryCode, setCountryCode] = useState(userData.countryCode || '');
  const [phoneNumber, setPhoneNumber] = useState(userData.phone || '');
  const errorsArray: string[] = [];
  const [errors, setErrors] = useState(errorsArray);
  const [loading, setLoading] = useState(false);


  async function sendVerificationSMS() {
    const data = { countryCode, phoneNumber };
    const errors = validate({countryCode, phoneNumber}, constraints, {format: "flat"});
    setErrors(errors);

    console.log(`[debug] sendVerificationSMS`);

    if (!errors) {
      setLoading(true);
      await apiSendVerificationSMS(countryCode, phoneNumber).then((response) => {
        if (response.errors) {
          setErrors(response.errors);
          return;
        }
        console.log(response)
        const optId = response.bulkgate.data.id;
        storeOptIdInURL(optId);

        setUserData({
          ...userData,
          countryCode,
          phone: phoneNumber,
          optId,
        });
      }).catch((error) => {
        if (error.message) {
          setErrors([error.message]);
        }
      });
      setLoading(false);
    }
    console.log(`[debug] `, errors, data);
  }

  return (
    <>
      <VStack>
        <BoxHeader title="Create your free NEMP account" />
        {errors && ErrorsDisplay(errors)}
        <VStack width={'100%'}>
          <Text as='b' fontSize={'sm'}>Verify your phone number</Text>
          <CountryCodesSelect 
            name="countryCode" 
            onChange={(e:React.ChangeEvent<HTMLSelectElement>) => { setCountryCode(e.currentTarget.value)}} 
            value={countryCode} placeholder="country code" size='sm' bg='white' 
          />
          <Input 
            name="phoneNumber" 
            onChange={(e:React.ChangeEvent<HTMLInputElement>) => { 
              setPhoneNumber(e.currentTarget.value)}
            } value={phoneNumber} 
            type="text" 
            placeholder="phone number" 
            size='sm' 
            bg='white' 
          />
        </VStack>
      </VStack>
      <Button 
        onClick={sendVerificationSMS}
        isLoading={loading}
        loadingText={'Sending ...'}
        w='100%' mt={10} colorScheme="nemp_yellow" color={'black'}>
        Send verification SMS
      </Button>
    </>
  )
}