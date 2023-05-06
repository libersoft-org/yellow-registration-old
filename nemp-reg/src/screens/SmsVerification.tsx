import { VStack, Input, Button, Text } from "@chakra-ui/react";
import BoxHeader from "../components/BoxHeader";

export default function SMSVerification (): JSX.Element {
  return (
    <>
      <BoxHeader title="Verify your NEPM account" />
      <VStack>
        <Text fontSize={'sm'} as="b" mb="2" color="nemp_yellow.600">+420 737 216 068</Text>
        <Input maxW={'150px'} placeholder="SMS Code" size='sm' bg={'white'} />
      </VStack>
      <Button w='100%' mt={10} colorScheme="nemp_yellow" color={'black'}>
        Verify
      </Button>
    </>
  )
}
