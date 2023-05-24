import { Flex, VStack, Input, Select, Button } from "@chakra-ui/react"
import BoxHeader from "../components/BoxHeader"
import { useState } from "react"
import { UserDataProps } from "../App"
import { validate } from "validate.js";
import { apiFinishRegistration } from "../api/api"
import ErrorsDisplay from "../components/Errors"
import BirthDateInputs from "../components/BirthDateInputs";

const constraints = {
  username: {
    presence: true,
    length: {
      minimum: 5,
      maximum: 20,
    },
    format: {
      pattern: /^[a-zA-Z0-9.-]+$/,
      flags: 'i',
      message: 'not valid',
    },
  },
  domain: {
    presence: {allowEmpty: false},
  },
  firstname: {
    presence: {allowEmpty: false},
  },
  lastname: {
    presence: {allowEmpty: false},
  },
  birthdate: {
    presence: {allowEmpty: false},
    /*
    format: {
      pattern: /(((19|20)([2468][048]|[13579][26]|0[48])|2000)[/-]02[/-]29|((19|20)[0-9]{2}[/-](0[4678]|1[02])[/-](0[1-9]|[12][0-9]|30)|(19|20)[0-9]{2}[/-](0[1359]|11)[/-](0[1-9]|[12][0-9]|3[01])|(19|20)[0-9]{2}[/-]02[/-](0[1-9]|1[0-9]|2[0-8])))/,
      flags: 'i',
      message: 'not valid',
    },*/
  },
  gender: {
    presence: {allowEmpty: false},
  },
  password: {
    presence: true,
    length: {
      minimum: 6,
      maximum: 100,
    },
  },
  confirmPassword: {
    presence: true,
    equality: 'password',
  },
}

export default function UserForm (props: UserDataProps): JSX.Element {
  const { userData, setUserData } = props;
  const [loading, setLoading] = useState(false);
  const errorsArray: string[] = [];
  const [errors, setErrors] = useState(errorsArray);
  const [inputs, setInput] = useState({
    username: '',
    domain: '',
    firstname: '',
    lastname: '',
    gender: '',
    birthdate: '',
    password: '',
    confirmPassword: '', 
  });

  function selectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const {name, value} = e.currentTarget;
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
    if (Object.keys(inputs).includes(name)) {
      const update = {
        ...inputs,
        [name]: value
      }
      setInput(update);
    }
  }

  function setBirthDate(date: string) {
    const update = {
      ...inputs,
      birthdate: date,
    }
    setInput(update);
  }

  async function finish() {
    const errors = validate(inputs, constraints, {format: "flat"});
    setErrors(errors);

    if (!errors) {
      const data = {
        ...userData,
        ...inputs,
      }

      setUserData(data);

      setLoading(true);
      await apiFinishRegistration(data).then((response) => {
        if (response.errors) {
          setErrors(response.errors);
          return;
        }
        setErrors([]);
        setUserData({
          ...userData,
          password: null,
          optId: null,
          complete: true,
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
      <BoxHeader title="Create your free NEMP account" />
      {errors && ErrorsDisplay(errors)}
      <VStack>
        <Flex width={'100%'}>
          <Input name="username" onChange={inputChange} value={inputs.username} placeholder="user name" size='sm' flex={3} mr={2} bg={'white'} />
          <Select name="domain" onChange={selectChange} value={inputs.domain} placeholder='domain' size='sm' flex={2} bg={'white'}>
            <option value='nemp.io'>nemp.io</option>
          </Select>
        </Flex>
        <Input name="firstname" onChange={inputChange} value={inputs.firstname} placeholder="first name" size='sm' bg={'white'} />
        <Input name="lastname" onChange={inputChange} value={inputs.lastname} placeholder="last name" size='sm' bg={'white'} />
        <Select name="gender" onChange={selectChange} value={inputs.gender} placeholder='gender' size='sm' bg={'white'}>
          <option value='female'>♀️ female</option>
          <option value='male'>♂️ male</option>
        </Select>
        <BirthDateInputs inputs={inputs} setDate={setBirthDate} />
        <Input name="password" type="password" onChange={inputChange} value={inputs.password} placeholder="password" size='sm' bg={'white'} />
        <Input name="confirmPassword" type="password" onChange={inputChange} value={inputs.confirmPassword} placeholder="password again" size='sm' bg={'white'} />
      </VStack>
      <Button 
        w='100%' 
        mt={10} 
        colorScheme="nemp_yellow" 
        color={'black'}
        isLoading={loading}
        onClick={finish}
      >
        Finish registration
      </Button>
    </>
  )
}
