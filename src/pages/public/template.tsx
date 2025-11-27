import React from 'react'
import { useAppContext } from 'src/context/AppContext'
import styled from 'styled-components'

const Body = styled.div<{ isDark: boolean }>`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ isDark }) =>
    isDark
      ? '#333'
      : `radial-gradient(
    circle at 30% 30%,
    #ffe0ec,
    #e9f7ff 50%,
    #eaf7ef 100%
  )`};

  background-image: url('https://www.globaleffect.org/uploads/2/3/1/1/23115204/background-images/1618048994.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`

const Template: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { theme } = useAppContext()
  return <Body isDark={theme === 'dark'}>{children}</Body>
}

export default Template
