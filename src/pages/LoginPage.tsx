import AuthTemplate from "../components/auth/authTemplate";
import LoginForm from '../components/auth/LoginForm'

const LoginPage = () => {
  return (
    <div>
      <AuthTemplate >
        <LoginForm />
      </AuthTemplate>
    </div>
  );
};

export default LoginPage;