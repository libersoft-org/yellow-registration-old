import { Link, Text } from "@chakra-ui/react";
import { EmailIcon } from '@chakra-ui/icons'

export default function Footer () {
  return (
    <Text fontSize={'sm'} mt={'5'}>
      Have problem with registration? <Link href='mailto: info@libersoft.org' isExternal> Contact us - <EmailIcon /></Link>
    </Text>
  );
}
