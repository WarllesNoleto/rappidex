import { styled } from "styled-components";

export const BaseInput = styled.input`
  background: transparent;
  height: 2.5rem;
  width: 100%;
  border: 0;
  margin: 1rem 0rem 1rem 0rem;
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
    /* width: 100%; */
`;

export const BaseButton = styled.button`
  width: 100%;
  border: 0;
  padding: 1rem;
  margin: 1rem 0rem 1rem 0rem;
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