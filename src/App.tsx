import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.tsx'
import JoinPage from './pages/JoinPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
// import AirPage from './pages/AirPage.tsx';
// import WeatherPage from './pages/WeatherPage.tsx'
import Nav from './components/common/nav.tsx';
import styled from "@emotion/styled"
import Header from './components/common/header.tsx'
import { tokenData } from './store/slices/token-slice.ts';
import { useSelector } from 'react-redux';
const Container = styled.div`
width:100%;
max-width:1200px;
min-width:600px;

margin:0 auto;
position:relative;
margin-top:4em;

`
const App = () => {
  const { user } = useSelector(tokenData)
  if (!user) {
    return (

      <Container>
        <Routes>
          <Route path='/home' element={<LoginPage />} />
          <Route path='/join' element={<JoinPage />} />
          <Route path='/' element={<LoginPage />} />
        </Routes>
      </Container>
    )
  }

  return (
    <Container>
      <Header />
      <Nav />
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/join' element={<JoinPage />} />
        {/* <Route path='/weather' element={<WeatherPage />} /> */}
        <Route path='/home' element={<HomePage />} />
      </Routes>
    </Container>
  );
};

export default App;