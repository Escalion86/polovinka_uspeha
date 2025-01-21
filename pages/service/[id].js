function ServicePage(props) {
  return null
}

export default ServicePage

export const getServerSideProps = async (context) => {
  const { params } = context
  const { id } = params

  return {
    redirect: {
      destination: `/krsk/service/${id}`,
    },
  }
}
