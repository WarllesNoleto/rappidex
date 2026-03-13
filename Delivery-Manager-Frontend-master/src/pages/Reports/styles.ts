import { Link } from 'react-router-dom';
import styled from 'styled-components'

export const Container = styled.main`
  flex: 1;
  width: 100%;
  display: grid;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
`

export const FiltersContainer = styled.div`
  padding: 1rem;
`;

export const DataContainer = styled.div`
    margin-top: 1rem;

    input {
        margin-left: 0.5rem;
        margin-right: 0.5rem;
        height: 2.5rem;
        background: ${(props) => props.theme['gray-600']};
        color: ${(props) => props.theme['gray-100']};
    }
`;

export const Filter = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 1rem;
    align-items: center;
    
    select {
        margin-left: 1rem;
        height: 2.5rem;
        background: ${(props) => props.theme['gray-600']};
        color: ${(props) => props.theme['gray-100']};
    }
`;

export const SearchButton = styled.div`
    background: ${(props) => props.theme['green-700']};
    padding: 1rem;
    margin-top: 1rem;
    border-radius: 0.5rem;

    display: flex;
    align-items: center;
    justify-content: center;

    font-weight: bold;

    cursor: pointer;
`;

export const ReportsContainer = styled.div`
    background: ${(props) => props.theme['gray-700']};
    padding: 1rem;
    border-radius: 0.5rem;
`;

export const Delivery = styled.div`
    background-color: ${(props) => props.theme['gray-600']};
    padding: 1rem;
    margin: 0.5rem;
    border-radius: 10px;
`;

export const ContainerShopkeeper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const ShopkeeperProfileImage = styled.img`
  height: 6rem;
  width: 6rem;
  border-radius: 100%;
`;

export const ProfileImageContainer = styled.div`
  height: 6rem;
  width: 6rem;
  border-radius: 100%;
  border: solid;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ShopkeeperInfo = styled.div``;

export const ContainerOrder = styled.div`
  margin: 1rem;
`;

export const ContainerInfo = styled.div`
  margin: 1rem;
`;

export const EditContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const OnClickLink = styled(Link)`
  color: ${(props) => props.theme['gray-300']};
  text-decoration: none;
`;