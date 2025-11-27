import styled from 'styled-components'

const Container = styled.div`
  height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
`

const Image = styled.img`
  filter: ${({ theme }) => (theme.isDark ? 'invert(100%)' : undefined)};
`

const Home: React.FC = () => {
  return (
    <Container>
      <Image src={'assets/logo.png'} />
    </Container>
  )
}

export default Home
