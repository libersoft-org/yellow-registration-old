import { CheckCircleIcon } from '@chakra-ui/icons'
import { Center, Text } from '@chakra-ui/react'
import BoxHeader from '../components/BoxHeader'
import { UserDataProps } from '../App'

export default function Thanks (props: UserDataProps): JSX.Element {
  const { userData } = props;
  
  return (
    <>
      <BoxHeader title="Welcome in NEMP!" />
      <Center mb="5">
        <CheckCircleIcon boxSize="80px" color={'nemp_yellow.500'}/>
      </Center>
      <Text fontSize={'sm'} textAlign={'center'}>
        Thank you for registering as soon as the service is active we will contact you.
      </Text>
    </>
  )
}
