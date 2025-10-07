import AuthTemplate from "../components/auth/AuthTemplate";
import AuthForm from '../components/auth/AuthForm_sohee'

const JoinPage = () => {
  return (
    <div>
      <AuthTemplate >
        <AuthForm form={"join"} />
      </AuthTemplate>
    </div>
  );
};

export default JoinPage;