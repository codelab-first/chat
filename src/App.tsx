import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.tsx'
import JoinPage from './pages/JoinPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import styled from "@emotion/styled"
import Header from './components/common/header.tsx'
import { tokenData } from './store/slices/token-slice.ts';
import { useSelector } from 'react-redux';
const Containers = styled.div`
 position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: url('/images/background.jpg') no-repeat center center; 
  background-size: cover; /* ✅ 화면 크기에 맞게 꽉 채움 */
`
const Container = styled.div`
width:100%;
max-width:1200px;
min-width:600px;
margin:0 auto;
position:relative;

`
const WrapHeader = styled.div`
@media (max-width:860px){
display:none;
}
`
const App = () => {
  const { user } = useSelector(tokenData)
  if (!user) {
    return (
      <Containers>

        <Container>
          <Routes>
            <Route path='/home' element={<LoginPage />} />
            <Route path='/join' element={<JoinPage />} />
            <Route path='/' element={<LoginPage />} />
            <Route path='/join' element={<JoinPage />} />
          </Routes>
        </Container>
      </Containers>
    )
  }

  return (
    <Containers>
      <Container>
        <WrapHeader>
          <Header />
        </WrapHeader>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/join' element={<JoinPage />} />
          <Route path='/home' element={<HomePage />} />
        </Routes>
      </Container>
    </Containers>
  );
};

export default App;
