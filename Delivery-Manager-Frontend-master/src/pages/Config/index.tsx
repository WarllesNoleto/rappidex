/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useForm } from 'react-hook-form'

import { 
    BaseButton,
    BaseInput,
    BlockDeliveriesButton,
    Container,
    ContainerButtons,
    FormContainer
} from "./styles";
import { Loader } from '../../components/Loader';
import api from '../../services/api';
import { DeliveryContext } from '../../context/DeliveryContext';

const AmountFormValidationSchema = zod.object({
    amount: zod.string(),
  })

  
type AmountFormData = zod.infer<typeof AmountFormValidationSchema>

export function Config() {
    const { token } = useContext(DeliveryContext)
    api.defaults.headers.Authorization = `Bearer ${token}`
    
    const [loading, setLoading] = useState(true)
    const [loadingButton, setLoadingButton] = useState(false)
    const [loadingBlockButton, setLoadingBlockButton] = useState(false)
    const [blockType, setBlockType] = useState(false)
    const [formValues, setFormValues] = useState({
        amount: '0',
    })

    const amountFormData = useForm<AmountFormData>({
        resolver: zodResolver(AmountFormValidationSchema),
        values: formValues,
    })

    const { handleSubmit, watch, register } = amountFormData

    async function handleSave() {
        if(loadingButton) {
            return
        }

        if(parseInt(amount) === 0){
            alert('Você precisa digitar um valor!')
            return
        } 
        setLoadingButton(true)
        try {
            await api.put(`/delivery/edit/configs`, {"amountDeliverys": amount})
            setLoadingButton(false)
            alert("Número de entregas por motoboy alterada com sucesso!")
        } catch (error: any) {
            setLoadingButton(false)
            alert(error.response.data.message)
        }
    }

    async function handleBlock(){
        if(loadingBlockButton) {
            return
        }

        setLoadingBlockButton(true)

        try {
            await api.put(`/delivery/edit/configs`, {"blockDeliverys": !blockType})
            setLoadingBlockButton(false)
            setBlockType(!blockType)
            alert(!blockType ? "Entregas bloqueadas com sucesso." : "Entregas desbloqueadas com sucesso.")
        } catch (error: any) {
            setLoadingButton(false)
            alert(error.response.data.message)
        }
    }

    async function getConfigs() {
        try {
            const configs = await api.get(`/delivery/config`)
            setFormValues({ amount: configs.data.amount })
            setBlockType(configs.data.blockDeliverys)
            setLoading(false)
        } catch (error: any) {
            setLoading(false)
            alert(error.response.data.message)
        }
    }

    const amount = watch('amount')
    const isSubmitDisabled = !amount

    useEffect(() => {
        if(loading){
            getConfigs()
        }
    })

    return (
        <Container>
            {loading ? 
                <Loader size={10} biggestColor='gray' smallestColor='gray' /> :
                <>
                    <form onSubmit={handleSubmit(handleSave)} action="">
                        <FormContainer>
                            <label htmlFor="amount">Numero de entregas por motoboy:</label>
                            <BaseInput
                                type="number"
                                id="amount"
                                placeholder="Informe a quantidade."
                                {...register('amount')}
                            />

                            <ContainerButtons>
                                <BaseButton disabled={isSubmitDisabled} type="submit">
                                    {loadingButton ?
                                        <Loader size={20} biggestColor='gray' smallestColor='gray' /> :
                                        "Salvar"
                                    }
                                </BaseButton>
                            </ContainerButtons>
                        </FormContainer>
                    </form>
                    <BlockDeliveriesButton type={blockType} onClick={handleBlock}>
                        {loadingBlockButton ?
                            <Loader size={20} biggestColor='gray' smallestColor='gray' /> :
                            blockType ? "Desbloquear entregas" : "Bloquear entregas"
                        }
                    </BlockDeliveriesButton>
                </>
            }
        </Container>
    )
}