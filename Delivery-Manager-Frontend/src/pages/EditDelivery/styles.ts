import styled from 'styled-components'

export const Container = styled.main`
  flex: 1;
  width: 100%;
  display: grid;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
`

export const DeliveryContainer = styled.div`
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

  label {
    font-size: 15px;
    text-align: start;
    color: ${(props) => props.theme['gray-500']};
  }

  select {
    height: 2.5rem;
    width: 100%;
    background: ${(props) => props.theme['gray-600']};
    color: ${(props) => props.theme['gray-100']};
  }
`;

export const EditContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SaveButton = styled.button`
  background: ${(props) => props.theme['yellow-500']};
  width: 100%;
  border: 0;
  padding: 1rem;
  margin: 0.5rem 0rem 0.5rem 0rem;
  border-radius: 8px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 0.5rem;
  font-weight: bold;
  cursor: pointer;
`;
