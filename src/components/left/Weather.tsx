import React from 'react';
import styled from '@emotion/styled'
const Wraps = styled.div`
border:1px solid black;
width:50%;
height:70vh;
display:flex;
justify-content:center;
align-items:center;
`
const Weather = () => {
  return (
    <Wraps>
      Wheather
    </Wraps>
  );
};

export default Weather;