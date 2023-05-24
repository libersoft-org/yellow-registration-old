import { Image, Text, VStack } from '@chakra-ui/react';
import nempIcon from '../assets/icon_nemp.svg';

export interface IBoxHeaderProps {
  title: string,
}

export default function BoxHeader (props: IBoxHeaderProps) {
  return (
    <VStack mb={5}>
      <Image src={nempIcon} w={'50px'} />
      <Text fontSize='md' as={'b'}>{props.title}</Text>
    </VStack>
  );
}
