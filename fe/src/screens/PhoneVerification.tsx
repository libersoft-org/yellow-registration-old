import { VStack, Input, Button, Text} from "@chakra-ui/react";
import BoxHeader from "../components/BoxHeader";
import CountryCodesSelect from "../components/CountryCodesSelect";
import { useState } from "react";
import { validate } from "validate.js";
import { apiSendVerificationSMS } from "../api/api";
import { UserDataProps } from "../App";
import ErrorsDisplay from "../components/Errors";
import { storeOptIdInURL } from "../utils/urlParams";

const constraints = {
  countryCode: {
    presence: {allowEmpty: false},
  },
  phone: {
    presence: true,
    format: {
      pattern: /\d{1}[0-9]\d{3,14}/,
      flags: 'i',
      message: 'not valid',
    },
  },
};

export default function PhoneVerification(props: UserDataProps) {

  const { userData, setUserData } = props;

  const [countryCode, setCountryCode] = useState(userData.countryCode || '');
  const [phone, setPhoneNumber] = useState(userData.phone || '');
  const errorsArray: string[] = [];
  const [errors, setErrors] = useState(errorsArray);
  const [loading, setLoading] = useState(false);

  async function sendVerificationSMS() {
    const errors = validate({countryCode, phone}, constraints, {format: "flat"});
    setErrors(errors);

    if (!errors) {
      setLoading(true);
      await apiSendVerificationSMS(countryCode, phone).then((response) => {
        if (response.errors) {
          setErrors(response.errors);
          return;
        }

        const optId = response.bulkgate.data.id;
        storeOptIdInURL(optId);

        setUserData({
          ...userData,
          countryCode,
          phone,
          optId,
        });
      }).catch((error) => {
        if (error.message) {
          setErrors([error.message]);
        }
      });
      setLoading(false);
    }
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
            name="phone" 
            onChange={(e:React.ChangeEvent<HTMLInputElement>) => { 
              setPhoneNumber(e.currentTarget.value)}
            } value={phone} 
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