import { extendTheme } from '@chakra-ui/react';
import nempBg from './assets/doodle.png';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: '#FFFCEF',
        backgroundImage: nempBg,
        backgroundSize: '500px'
      },
    },
  },
  colors: {
    nemp_yellow: {
      50: '#FFFEF8',
      100: '#fff1ad',
      200: '#fde77e',
      300: '#fddd4d',
      400: '#fcd41c',
      500: '#FCD213',
      600: '#b09100',
      700: '#7e6700',
      800: '#4c3e00',
      900: '#1b1500',
    },
  },
});

export default theme;
