export default function Home(props) {
  return null
}

export const getServerSideProps = async (context) => {
  return {
    redirect: {
      destination: `/krsk/events`,
    },
  }
}
