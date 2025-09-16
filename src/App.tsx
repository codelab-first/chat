import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.tsx'
import JoinPage from './pages/JoinPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import AirPage from './pages/AirPage.tsx';
import WheatherPage from './pages/WheatherPage.tsx'
import Nav from './components/common/nav.tsx';
import styled from "@emotion/styled"
import Header from './components/common/header.tsx'
const Container = styled.div`
width:100%;
max-width:1200px;
min-width:600px;

margin:0 auto;
position:relative;
margin-top:4em;

`
const App = () => {
  return (
    <Container>
      <Header />
      <Nav />
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/air' element={<AirPage />} />
        <Route path='/wheather' element={<WheatherPage />} />
      </Routes>
    </Container>
  );
};

export default App;