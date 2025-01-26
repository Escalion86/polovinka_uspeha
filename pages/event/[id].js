function EventPage(props) {
  return null
}

export default EventPage

export const getServerSideProps = async (context) => {
  const { params } = context
  const { id } = params

  return {
    redirect: {
      destination: `/krsk/event/${id}`,
    },
  }
}
