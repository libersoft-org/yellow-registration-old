import { VStack, Flex, Input, Button, Container, Text, Stack, Badge } from "@chakra-ui/react";
import BoxHeader from "../components/BoxHeader";
import CountryCodesSelect from "../components/CountryCodesSelect";
import { useState } from "react";
import { validate } from "validate.js";
import { apiSendVerificationSMS } from "../api/api";
import { WarningTwoIcon } from "@chakra-ui/icons";

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


export default function SendSMSVerification() {

  const [countryCode, setCountryCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const errorsArray: string[] = [];
  const [errors, setErrors] = useState(errorsArray);

  async function sendVerificationSMS() {
    const data = {countryCode, phoneNumber};
    const errors = validate({countryCode, phoneNumber}, constraints,  {format: "flat"});
    setErrors(errors);

    if (!errors) {
      await apiSendVerificationSMS(countryCode, phoneNumber).then((response) => {
        if (response.errors) {
          setErrors(response.errors);
          return;
        }

        const optId = response.bulkgate.id;
        storeOptIdInURL(optId);
        

      }).catch((error) => {
        if (error.message) {
          setErrors([error.message]);
        }
      });
    }
    console.log(`[debug] `, errors, data);

  }

  return (
    <>
      <VStack>
        <BoxHeader title="Create your free NEMP account" />
        {errors && <VStack pb={4}>
          { /*<Text color={'red'} as="b" fontSize={'xs'}><WarningTwoIcon /> Errors</Text> */}
          {errors.map((error, i) => <Badge key={`err-${i}`} colorScheme='red'>{error}</Badge>)}
        </VStack>}
        <VStack width={'100%'}>
          <CountryCodesSelect name="countryCode" onChange={(e:React.ChangeEvent<HTMLSelectElement>) => { setCountryCode(e.currentTarget.value)}} value={countryCode} placeholder="country code" size='sm' bg='white' />
          <Input name="phoneNumber" onChange={(e:React.ChangeEvent<HTMLInputElement>) => { setPhoneNumber(e.currentTarget.value)}} value={phoneNumber} type="text" placeholder="phone number" size='sm' bg='white' />
        </VStack>
      </VStack>
      <Button onClick={sendVerificationSMS} w='100%' mt={10} colorScheme="nemp_yellow" color={'black'}>
        Send verification SMS
      </Button>
    </>
  )
}