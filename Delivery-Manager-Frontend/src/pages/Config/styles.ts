import styled from 'styled-components'

export const Container = styled.main`
  flex: 1;
  width: 100%;
  display: grid;
  align-items: center;
  justify-content: center;

  margin-top: 2rem;
  
  background: ${(props) => props.theme['gray-600']};

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 2rem;
  }
`

export const FormContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  color: ${(props) => props.theme['gray-100']};
  font-size: 1.125rem;
  font-weight: bold;
  
  gap: 2rem;
  margin-top: 3rem;

  label {
    font-size: 15px;
    text-align: start;
    color: ${(props) => props.theme['gray-500']};
  }
`

export const BaseInput = styled.input`
  flex: 1;
  width: 17rem;
  background: transparent;
  height: 2.5rem;
  border: 0;
  border-bottom: 2px solid ${(props) => props.theme['gray-500']};
  font-weight: bold;
  font-size: 1.125rem;
  color: ${(props) => props.theme['gray-100']};

  &:focus {
    box-shadow: none;
    border-bottom: 2px solid ${(props) => props.theme['green-500']};
  }

  &::placeholder {
    color: ${(props) => props.theme['gray-500']};
  }
`

export const ContainerButtons = styled.div`
    width: 100%;
`;

export const BaseButton = styled.button`
  width: 100%;
  border: 0;
  padding: 1rem;
  margin: 0rem 0rem 1rem 0rem;
  border-radius: 8px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 0.5rem;
  font-weight: bold;
  cursor: pointer;

  background: ${(props) => props.theme['green-700']};
  color: ${(props) => props.theme['gray-100']};
`

interface BlockDeliveriesButtonProps {
  type: boolean
}

export const BlockDeliveriesButton = styled.button<BlockDeliveriesButtonProps>`
  width: 100%;
  border: 0;
  padding: 1rem;
  margin: 0rem 0rem 1rem 0rem;
  border-radius: 8px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 0.5rem;
  font-weight: bold;
  cursor: pointer;

  background: ${(props) => props.type ? props.theme['green-700'] : props.theme['red-500']};
  color: ${(props) => props.theme['gray-100']};
`