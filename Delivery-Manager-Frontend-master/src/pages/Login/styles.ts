import styled from 'styled-components'

export const Container = styled.main`
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    margin-top: 18rem;
  }
`

export const BaseButton = styled.button`
  width: 100%;
  border: 0;
  padding: 1rem;
  margin: 1rem;
  border-radius: 8px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 0.5rem;
  font-weight: bold;
  color: ${(props) => props.theme['gray-500']};

  cursor: pointer;
`

export const FormContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme['gray-100']};
  font-size: 1.125rem;
  font-weight: bold;
  
  gap: 1rem;
`

export const BaseInput = styled.input`
  flex: 1;
  width: 20rem;
  background: transparent;
  height: 2.5rem;
  border: 0;
  /* border-bottom: 2px solid ${(props) => props.theme['gray-500']}; */
  font-weight: bold;
  font-size: 1.125rem;
  padding: 0 0.5rem;
  color: ${(props) => props.theme['gray-100']};

  &:focus {
    box-shadow: none;
    border: 2px solid ${(props) => props.theme['green-500']};
  }

  &::placeholder {
    color: ${(props) => props.theme['gray-500']};
  }
`

export const Logo = styled.img`
  height: 8rem;
  width: 8rem;
  border-radius: 100%;
  margin-bottom: 2rem;
`;
