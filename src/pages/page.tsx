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
      {/* <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1000"
        height="320"
        viewBox="0 0 1500 320"
      >
        <g
          transform="translate(190 175)"
          fill="none"
          stroke="#ffffff"
          stroke-width="4"
        >
          <ellipse rx="95" ry="75" />
          <ellipse rx="55" ry="75" />
          <ellipse rx="30" ry="75" />
          <ellipse rx="80" ry="40" />
          <ellipse rx="80" ry="20" />
          <path d="M-115-40 C-40-125 100-50 120 20" />
        </g>
        <g
          fill="#e8ebf0"
          font-family="'Abadi ExtraLight', 'Trajan Pro', 'Palatino Linotype', Palatino, 'Times New Roman', serif"
          font-size="100"
          font-weight="500"
          letter-spacing="2"
        >
          <text x="270" y="130">
            GLOBAL
          </text>
        </g>
        <text
          x="320"
          y="205"
          fill="#e8ebf0"
          font-family="'Abadi ExtraLight', 'Trajan Pro', 'Palatino Linotype', Palatino, 'Times New Roman', serif"
          font-size="90"
          font-weight="500"
          letter-spacing="2"
          opacity=".95"
        >
          EFFECT
        </text>
      </svg> */}
    </Container>
  )
}

export default Home
