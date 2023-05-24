import { Badge, VStack } from "@chakra-ui/react";

export default function ErrorsDisplay(errors: string[]) {
  return (
    <VStack pb={4}>
      { /*<Text color={'red'} as="b" fontSize={'xs'}><WarningTwoIcon /> Errors</Text> */}
      {errors.map((error, i) => <Badge key={`err-${i}`} colorScheme='red'>{error}</Badge>)}
    </VStack>
  )
}