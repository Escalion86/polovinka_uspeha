const Login = (props) => {
  return null
}

export default Login

export const getServerSideProps = async (context) => {
  return {
    redirect: {
      destination: `/krsk/login`,
    },
  }
}
