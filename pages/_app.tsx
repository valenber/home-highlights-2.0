/* NextJS page */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/display-name */

import { AppProps } from 'next/app';

// UI framework styles
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/nova-dark/theme.css';
// custom shared styles
import '../styles/shared.css';

export default ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />;
};
