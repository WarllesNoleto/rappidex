/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { Report, User } from "../../shared/interfaces";
import api from "../../services/api";
import { DeliveryContext } from "../../context/DeliveryContext";
import { Loader } from "../../components/Loader";
import { Container, ContainerInfo, ContainerOrder, ContainerShopkeeper, Delivery, DeliveryContainer, EditContainer, ProfileImageContainer, SaveButton, ShopkeeperInfo, ShopkeeperProfileImage } from "./styles";
import { StatusDelivery } from "../../shared/constants/enums.constants";

export function EditDelivery(){
    const location = useLocation();
    const report: Report = location.state

    const { token } = useContext(DeliveryContext)
    api.defaults.headers.Authorization = `Bearer ${token}`

    const [loading, setLoading] = useState(true)
    const [loadingButton, setLoadingButton] = useState(false)
    const [motoboys, setMotoboys] = useState([]);

    const [selectedStatus, setSelectedStatus] = useState(report.status);
    const [selectedMotoboy, setSelectedMotoboy] = useState(report.motoboyId);

    async function handleSave(){
        if(loadingButton){
            return
        }

        setLoadingButton(true)
        try {
            await api.put(`/delivery/${report.id}`, {
                'motoboyId': selectedMotoboy,
                'status': selectedStatus
            })
            setLoadingButton(false)
            alert(`Entrega atualização com sucesso.`)
        } catch (error: any) {
            alert(error.response.data.message)
            setLoadingButton(false)
        }
    }

    async function getMotoboys() {
        try {
            const motoboysResponse = await api.get('/user?type=motoboy')

            setMotoboys(motoboysResponse.data.data)
            setLoading(false)
        } catch (error: any) {
            alert(error.response.data.message)
        }
    }

    useEffect(() => {
        if(loading){
            getMotoboys()
        }
    })
    return (
        <Container>
            {loading ?
                <Loader size={40} biggestColor='gray' smallestColor='gray' /> :
                <DeliveryContainer>
                    <Delivery>
                        <ContainerShopkeeper>
                            <ProfileImageContainer>
                                <ShopkeeperProfileImage src={report.establishmentImage} />
                            </ProfileImageContainer>
                            <ShopkeeperInfo>
                                <p>{report.establishmentName}</p>
                            </ShopkeeperInfo>
                        </ContainerShopkeeper>
                        <ContainerOrder>
                            <p>Forma de pagamento: {report.payment}</p>
                            <p>Valor: R$ {report.value}</p>
                            <p>Pix: {report.establishmentPix}</p>
                            <p>Refrigerante: {report.soda}</p>
                            <p>Cliente: {report.clientName} </p>
                        </ContainerOrder>

                        <ContainerInfo>
                            <select 
                            value={selectedStatus}
                            onChange={e => setSelectedStatus(e.target.value)}
                            >
                                <option value={StatusDelivery.CANCELED}>Cancelado</option>
                                <option value={StatusDelivery.COLLECTED}>Coletado</option>
                                <option value={StatusDelivery.FINISHED}>Finalizado</option>
                                <option value={StatusDelivery.ONCOURSE}>A caminho</option>
                                <option value={StatusDelivery.PENDING}>Pendente</option>
                            </select>
                        </ContainerInfo>

                        <ContainerInfo>
                            <select 
                                value={selectedMotoboy}
                                onChange={e => setSelectedMotoboy(e.target.value)}
                            >
                                {
                                    motoboys.map((motoboy: User) => 
                                        <option key={motoboy.id} value={motoboy.id}>{motoboy.name}</option>
                                    )
                                }
                            </select>   
                        </ContainerInfo>

                        <EditContainer>
                            <SaveButton onClick={handleSave}>
                                {loadingButton ? 
                                    <Loader size={20} biggestColor='black' smallestColor='black' /> :
                                    'Salvar'
                                }
                            </SaveButton>
                        </EditContainer>
                    </Delivery>
                </DeliveryContainer>
            }
        </Container>
    )
}