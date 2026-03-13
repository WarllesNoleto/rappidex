import styled from 'styled-components'

export const LayoutContainer = styled.div`
  margin: 0.5rem;
  padding: 1rem;

  background: ${(props) => props.theme['gray-800']};
  border-radius: 8px;

  display: flex;
  flex-direction: column;
`
