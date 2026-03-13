import { useContext, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useForm } from 'react-hook-form'

import { 
    BaseButton,
    BaseInput,
    Container,
    ContainerButtons,
    FormContainer
} from "./styles";
import { Loader } from '../../components/Loader';
import api from '../../services/api';
import { DeliveryContext } from '../../context/DeliveryContext';

const ChangePassFormValidationSchema = zod.object({
    oldPassword: zod.string().min(4, 'Informe a senha antiga.'),
    newPassword: zod.string().min(4, 'Informe a nova senha.'),
  })

  
type ChangePassFormData = zod.infer<typeof ChangePassFormValidationSchema>

export function ChangePassword() {
    const { token } = useContext(DeliveryContext)
    api.defaults.headers.Authorization = `Bearer ${token}`
    
    const [loading, setLoading] = useState(false)
    const changePasswordFormData = useForm<ChangePassFormData>({
        resolver: zodResolver(ChangePassFormValidationSchema),
        defaultValues: {
            oldPassword: '',
            newPassword: '',
        },
    })


    const { handleSubmit, watch, register, reset } = changePasswordFormData

    const oldPassword = watch('oldPassword')
    const newPassword = watch('newPassword')
    const isSubmitDisabled = !oldPassword || !newPassword

    async function handleSave(data: ChangePassFormData) {
        if(loading) {
            return
        }

        setLoading(true)
        try {
            await api.post('/auth/change-password', data)
            reset()
            setLoading(false)
            alert("Senha alterada com sucesso!")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setLoading(false)
            alert(error.response.data.message)
        }
    }

    return (
        <Container>
            <form onSubmit={handleSubmit(handleSave)} action="">
                <FormContainer>
                    <label htmlFor="name">Senha antiga:</label>
                    <BaseInput
                        type="password"
                        id="oldPassword"
                        placeholder="Informe a senha antiga."
                        {...register('oldPassword')}
                    />

                    <label htmlFor="name">Nova senha:</label>
                    <BaseInput
                        type="password"
                        id="newPassword"
                        placeholder="Informe a nova senha."
                        {...register('newPassword')}
                    />

                    <ContainerButtons>
                        <BaseButton disabled={isSubmitDisabled || loading} type="submit">
                            {loading ?
                                <Loader size={20} biggestColor='gray' smallestColor='gray' /> :
                                "Salvar"
                            }
                        </BaseButton>
                    </ContainerButtons>
                </FormContainer>
            </form>
        </Container>
    )
}