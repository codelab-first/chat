import Air from "../components/left/Air";
import Weather from "../components/left/Weather";
import Map from "../components/right/Map";
import styled from '@emotion/styled'
const WrapperData = styled.div`
display:flex;
justify-content:center;
align-items:center;
margin-top:2.5em

`
const WheatherPage = () => {
  return (
    <WrapperData>
      <Air />
      {/* <Weather /> */}
      <Map />
    </WrapperData>
  );
};

export default WheatherPage;