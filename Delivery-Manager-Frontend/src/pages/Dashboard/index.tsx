/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import { WhatsappLogo, MapPin } from 'phosphor-react'

import { DeliveryContext } from "../../context/DeliveryContext";
import api from "../../services/api";
import { Motoboy, Report } from '../../shared/interfaces'

import { 
    BaseButton, 
    Container, 
    ContainerButtons, 
    ContainerInfo, 
    ContainerDeliveries, 
    ContainerOrder, 
    ContainerShopkeeper, 
    Delivery, 
    Link, 
    ShopkeeperInfo, 
    ShopkeeperProfileImage, 
    OrderActions,
    OrderButton,
    SelectContainer,
    ContainerImagem,
    ContainerLoading,
    ContainerStatus,
    Status,
    Flag,
} from "./styles";
import { Loader } from '../../components/Loader';
import { BaseModal } from "../../components/Modal";
import { StatusDelivery } from "../../shared/constants/enums.constants";
import { getLinkToWhatsapp, messageTypes } from "../../shared/constants/whatsapp.constants";

export function Dashboard() {
    const { token, permission } = useContext(DeliveryContext)
    api.defaults.headers.Authorization = `Bearer ${token}`

    const [status, setStatus] = useState(`${StatusDelivery.PENDING}`);
    const [loading, setLoading] = useState(true);
    const [reports, setReports] = useState([]);
    const [motoboys, setMotoboys] = useState<Motoboy[]>([]);
    const [reportsCount, setReportsCount] = useState(0)

    const [selectedMotoboy, setSelectedMotoboy] = useState('')

    const [isVisible, setIsVisible] = useState(false)
    const [observation, setObservation] = useState('')
    const [reportSelectedToModal, setReportSelectedToModal] = useState('')

    function handleModal() {
        setIsVisible(!isVisible)
    }

    async function getData() {
        setLoading(true)
        setReports([])

        try {
            const response = await api.get(`/delivery?status=${status}`)
            setReports(response.data.data)
            setReportsCount(response.data.count)

            if (permission !== 'shopkeeper') {
                const motoboysRes = await api.get('/user/motoboys')
                setMotoboys(motoboysRes.data)
            }

            setLoading(false)
            } catch (error: any) {
            alert(error.response.data.message)
        }
    }

    async function handlerNextStep(report: Report) {
        let data;
        let newStatus;

        if(report.status === StatusDelivery.COLLECTED && report.id != reportSelectedToModal){
            setReportSelectedToModal(report.id)
            handleModal()
            return
        }

        if(report.status === StatusDelivery.PENDING){
            if(!selectedMotoboy){
                alert('Selecione o motoboy')
            }
    
            newStatus = StatusDelivery.ONCOURSE
            data = {
                'status': newStatus,
                'motoboyId': selectedMotoboy
            }
        } else if(report.status === StatusDelivery.ONCOURSE){
            newStatus = StatusDelivery.COLLECTED
            data = {
                'status': newStatus
            }
        } else if(report.status === StatusDelivery.COLLECTED){
            newStatus = StatusDelivery.FINISHED
            data = {
                'status': newStatus,
                'observation': observation === 'Sem observação.' ? '' : observation
            }
        }

        try {
            await api.put(`/delivery/${report.id}`, data)
            getData()
            alert(`Solicitação avançada para o passo ${newStatus}`)
            setObservation('')
            setReportSelectedToModal('')
        } catch (error: any) {
            alert(error.response.data.message)
        }
    }

    async function handlerSave(report: Report) {
        if(!selectedMotoboy){
            alert('Selecione o motoboy')
        }

        try {
            await api.put(`/delivery/${report.id}`, {
                'motoboyId': selectedMotoboy
            })
            getData()
            alert(`Motoboy foi atualizado com sucesso.`)
        } catch (error: any) {
            alert(error.response.data.message)
        }
    }

    async function handlerCancel(report: Report) {
        const confirmMessage = confirm('Você realmente deseja apagar essa entrega?');
        if(!confirmMessage){
            return
        }

        try {
            await api.put(`/delivery/${report.id}`, {
                'status': 'CANCELADO'
            })
            getData()
            alert(`O pedido foi cancelado com sucesso.`)
        } catch (error: any) {
            alert(error.response.data.message)
        }
    }

    async function handlerDelete(report: Report) {
        try {
            await api.delete(`/delivery/${report.id}`)
            alert('Solicitação apagada com sucesso.')
            getData()
        } catch (error: any) {
            alert(error.response.data.message)
        }
    }

    function getButtonText(status: string, id: string) {
        if (StatusDelivery.PENDING === status) {
            return 'Atribuir'
        } else if (StatusDelivery.ONCOURSE === status) {
            return 'Coletar'
        } else if (StatusDelivery.COLLECTED === status) {
            if(id != reportSelectedToModal) {
                return 'Observação'
            }
            return 'Finalizar'
        } 

        return 'Avançar'
    }

    function formatPhoneNumber(phone: string){
        const number = `+55${phone}`
        const cleaned = ('' + number).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{2})(\d{2})(\d{4}|\d{5})(\d{4})$/);

        if (match) {
            return ['(', match[2], ')', match[3], '-', match[4]].join('')
        }
        return '';
    }

    function getHours(date: string) {
        return date.split('T')[1].substring(0, 5)
    }

    useEffect(() => {
        if(motoboys.length === 1) {
            setSelectedMotoboy(motoboys[0].id)
        }
    }, [motoboys])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status])

    return (
        <Container>
            <BaseModal isVisible={isVisible} handleClose={handleModal} setObservation={setObservation} />
            <ContainerButtons>
                    <BaseButton typeReport={status == StatusDelivery.PENDING} onClick={() => setStatus(StatusDelivery.PENDING)}>
                        Livres 
                        {!loading && status == StatusDelivery.PENDING &&
                            <Flag>
                                {reportsCount}
                            </Flag>
                        }
                    </BaseButton>
                    <BaseButton typeReport={status != StatusDelivery.PENDING} onClick={() => setStatus(`${StatusDelivery.ONCOURSE},${StatusDelivery.COLLECTED}`)}>
                        Atribuídos 
                        {!loading && status != StatusDelivery.PENDING &&
                            <Flag>
                                {reportsCount}
                            </Flag>
                        }
                    </BaseButton>
            </ContainerButtons>
            <ContainerDeliveries>
                {
                    loading ? 
                        <ContainerLoading>
                            <Loader size={40} biggestColor="green" smallestColor="gray" />
                        </ContainerLoading> :
                        <>
                            { reports.map((report: Report) =>
                                <Delivery key={report.id} isfree={report.status === 'PENDENTE'}>
                                    <ContainerShopkeeper>
                                        <ContainerImagem>
                                            <ShopkeeperProfileImage src={report.establishmentImage} />
                                        </ContainerImagem>
                                        <ShopkeeperInfo>
                                            <p>{report.establishmentName}</p>
                                            <Link href={getLinkToWhatsapp(report.establishmentPhone, messageTypes.motoboy)} target="_blank" rel="noopener noreferrer">
                                                {formatPhoneNumber(report.establishmentPhone)} <WhatsappLogo size={18} />
                                            </Link>
                                            <Link href={report.establishmentLocation} target="_blank" rel="noopener noreferrer">
                                                <p>Localização</p> <MapPin size={18} />
                                            </Link>
                                        </ShopkeeperInfo>
                                    </ContainerShopkeeper>

                                    {status != StatusDelivery.PENDING &&
                                    
                                        <ContainerOrder>
                                            <ContainerStatus>
                                            <p>Status:</p><Status type={report.status}>{report.status}</Status>
                                            </ContainerStatus>
                                            <p>Forma de pagamento: {report.payment}</p>
                                            <p>Valor: R$ {report.value}</p>
                                            <p>Pix: {report.establishmentPix}</p>
                                            <p>Refrigerante: {report.soda}</p>
                                        </ContainerOrder>
                                    }
                                        <ContainerInfo>
                                            <p>Cliente: {report.clientName} </p>
                                            {status != StatusDelivery.PENDING &&
                                                <Link href={getLinkToWhatsapp(report.clientPhone, messageTypes.client)} target="_blank" rel="noopener noreferrer">
                                                    {formatPhoneNumber(report.clientPhone)} <WhatsappLogo size={18} />
                                                </Link>
                                            }
                                        </ContainerInfo>

                                    {status != StatusDelivery.PENDING &&
                                        <ContainerInfo>
                                            <p>Motoboy: {report.motoboyName} </p>
                                            <Link href={getLinkToWhatsapp(report.motoboyPhone, messageTypes.establishment)} target="_blank" rel="noopener noreferrer">
                                                {formatPhoneNumber(report.motoboyPhone)} <WhatsappLogo size={18} />
                                            </Link>
                                        </ContainerInfo>
                                    }
                                    <ContainerInfo>
                                        {report.createdAt && 
                                            <p>Criado: {getHours(report.createdAt)}</p>
                                        }
                                        {report.onCoursedAt && 
                                            <p>Atribuído: {getHours(report.onCoursedAt)}</p>
                                        }
                                        {report.collectedAt && 
                                            <p>Coletado: {getHours(report.collectedAt)}</p>
                                        }
                                        {report.finishedAt && 
                                            <p>Finalizado: {getHours(report.finishedAt)}</p>
                                        }
                                    </ContainerInfo>
                                    {
                                        permission !== "shopkeeper" && 
                                        <SelectContainer>
                                            <label htmlFor="motoboy">Motoboy:</label>
                                            <select 
                                                value={selectedMotoboy}
                                                onChange={e => setSelectedMotoboy(e.target.value)}
                                            >
                                                <option value="">Selecione o motoboy:</option>
                                                {
                                                    motoboys.map((motoboy: Motoboy) => 
                                                        <option key={motoboy.id} value={motoboy.id}>{motoboy.name}</option>
                                                    )
                                                }
                                            </select>
                                        </SelectContainer>
                                    }
                                    <OrderActions>
                                        {
                                            permission === "admin" && report.status !== "PENDENTE" && 
                                            <>
                                                <OrderButton typebutton={true} onClick={() => handlerSave(report)}>Salvar</OrderButton>
                                                <OrderButton typebutton={false} onClick={() => handlerCancel(report)}>Cancelar</OrderButton>
                                            </>
                                        }
                                        {
                                            permission !== "shopkeeper" &&
                                            <OrderButton typebutton={true} onClick={() => handlerNextStep(report)}>{getButtonText(report.status, report.id)}</OrderButton>
                                        }
                                        {
                                            permission !== "motoboy" && report.status === "PENDENTE" &&
                                            <OrderButton typebutton={false} onClick={() => handlerDelete(report)}>Apagar</OrderButton>
                                        }
                                    </OrderActions>
                                </Delivery>
                            )}
                        </>
                }
            </ContainerDeliveries>
        </Container>
    )
}