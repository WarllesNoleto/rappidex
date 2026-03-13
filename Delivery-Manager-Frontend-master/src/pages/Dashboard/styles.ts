import styled from 'styled-components'
import { StatusDelivery } from '../../shared/constants/enums.constants';

export const Container = styled.main`
  flex: 1;
  width: 100%;
  display: grid;
  align-items: center;
  justify-content: center;

  margin-top: 2rem;
`

export const ContainerButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

interface ButtonProps {
  typeReport: boolean
}

export const BaseButton = styled.div<ButtonProps>`
  background: ${(props) => props.typeReport ? props.theme['gray-600'] : props.theme['gray-800']};

  border: solid;
  padding: 1rem;
  border-radius: 1rem 1rem 0rem 0rem;
  border-color: ${(props) => props.typeReport ? props.theme['gray-600'] : props.theme['gray-600']};

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: bold;
  color: ${(props) => props.typeReport ? props.theme['gray-300'] : props.theme['gray-500']};

  cursor: pointer;
`

export const ContainerDeliveries = styled.div`
  background: ${(props) => props.theme['gray-600']};
  min-width: 20rem;
  border-radius: 1rem;
`;

interface DeliveryProps {
  isfree: boolean
}

export const Delivery = styled.div<DeliveryProps>`
  background-color: ${(props) => props.isfree ? props.theme['green-700'] : props.theme['gray-700']};
  padding: 1rem;
  margin: 0.5rem;
  border-radius: 10px;
`;

export const Link = styled.a`
  display: flex;
  gap: 0.2rem;
  text-decoration: none;
  color: ${(props) => props.theme['gray-300']};

  font-weight: bold;
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

export const ContainerImagem = styled.div`
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

export const OrderActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

interface OrderProps {
  typebutton: boolean
}

export const OrderButton = styled.div<OrderProps>`
  /* background: ${(props) => props.theme['gray-800']}; */
  background: ${(props) => props.typebutton ? props.theme['green-500'] : props.theme['red-700']};
  border: none;
  border-radius: 10%;

  margin-top: 1rem;
  padding: 1rem;

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: bold;
  color: ${(props) => props.theme['gray-300']};

  cursor: pointer;
`;

export const SelectContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  select {
    height: 2.5rem;
    background:  ${(props) => props.theme['gray-600']};
    color: ${(props) => props.theme['gray-100']};
  }
`;

export const ContainerLoading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ContainerStatus = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
`;

interface StatusProps {
  type: string
}

export const Status = styled.p<StatusProps>`
  background-color: ${(props) => props.type === StatusDelivery.ONCOURSE ? 'blue' : 'green'};
`;

export const Flag = styled.p`
  background-color: ${(props) => props.theme['green-700']};
  width: 15px;
  text-align: center;
`