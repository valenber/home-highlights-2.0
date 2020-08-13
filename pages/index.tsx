/* stylelint-disable react/jsx-no-undef */
/* NextJS page */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { useEffect } from 'react';
import fetch from 'isomorphic-unfetch';

const IndexPage = () => {
  useEffect((): void => {
    console.log('calling db...');
    fetch('/api/events')
      .then((res) => res.json())
      .then((data) => console.log(data));
  }, []);

  return (
    <>
      <h1>Home Highlights 2.0</h1>
    </>
  );
};

export default IndexPage;
