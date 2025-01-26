function UserPage(props) {
  return null
}

export default UserPage

export const getServerSideProps = async (context) => {
  const { params } = context
  const { id } = params

  return {
    redirect: {
      destination: `/krsk/user/${id}`,
    },
  }
}
