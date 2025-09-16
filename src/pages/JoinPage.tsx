import AuthTemplate from "../components/auth/authTemplate";
import JoinForm from '../components/auth/JoinForm'

const JoinPage = () => {
  return (
    <div>
      <AuthTemplate >
        <JoinForm />
      </AuthTemplate>
    </div>
  );
};

export default JoinPage;