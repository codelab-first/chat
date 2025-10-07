import AuthTemplate from "../components/auth/AuthTemplate";
import AuthForm from '../components/auth/AuthForm_sohee'

const LoginPage = () => {
  return (
    <div>
      <AuthTemplate >
        <AuthForm form="login" />
      </AuthTemplate>
    </div>
  );
};

export default LoginPage;