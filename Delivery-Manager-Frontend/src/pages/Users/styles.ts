import styled from 'styled-components'

export const Container = styled.main`
  flex: 1;
  width: 100%;
  display: grid;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
`

export const Content = styled.div``;

export const HeaderFilter = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
`;

interface FilterProps {
    isSelected: boolean
}
export const Filter = styled.div<FilterProps>`
    width: 100%;
    border: solid;
    border-color:  ${(props) => props.theme['gray-500']};
    padding: 1rem;
    margin: 0rem 0rem 1rem 0rem;
    border-radius: 8px;

    display: flex;
    align-items: center;
    justify-content: center;

    gap: 0.5rem;
    font-weight: bold;
    cursor: pointer;

    background-color: ${(props) => props.isSelected && props.theme['gray-500']};
    color: ${(props) => props.isSelected && props.theme['gray-900']};
`;

export const ContainerLoading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const UsersContainer = styled.div``;

export const UserContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border-radius: 8px;
    margin: 0rem 0rem 1rem 0rem;

    cursor: pointer;
    background-color: ${(props) => props.theme['gray-600']};
`;

export const ContainerProfileImage = styled.div`
  height: 7rem;
  width: 7rem;

  border-radius: 100%;
  border: solid;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ProfileImage = styled.img`
  height: 7rem;
  width: 7rem;
  border-radius: 100%;
`;

export const Username = styled.p`
    font-weight: bold;
`;