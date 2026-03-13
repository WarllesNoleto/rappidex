/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useForm } from 'react-hook-form'
import OneSignal from 'react-onesignal';

import { DeliveryContext } from '../../context/DeliveryContext';
import api from '../../services/api';

import { 
    BaseInput, 
    ChangePasswordButton, 
    Container, 
    ContainerButtons, 
    ContainerProfileImage, 
    FormContainer, 
    ProfileImage,
    NotificationButton,
} from "./styles";
import { Loader } from '../../components/Loader';

const ProfileFormValidationSchema = zod.object({
    name: zod.string().min(5, 'Informe o seu nome.'),
    phone: zod
      .string()
      .min(11, 'Informe o seu numero.')
      .max(11),
    pix: zod.string(),
    profileImage: zod.string(),
    location: zod.string()
  })

  
type ProfileFormData = zod.infer<typeof ProfileFormValidationSchema>

export function Profile(){
    const { token, permission } = useContext(DeliveryContext)
    api.defaults.headers.Authorization = `Bearer ${token}`

    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [loadingNotification, setLoadingNotification] = useState(false)
    const [username, setUsername] = useState('')
    const [profileImage, setProfileImage] = useState('')
    const [formValues, setFormValues] = useState({
        name: '',
        phone: '',
        pix: '',
        profileImage: '',
        location: ''
    })

    const { register } = useForm<ProfileFormData>({
        resolver: zodResolver(ProfileFormValidationSchema),
        values: formValues,
    })

    function handleConfig() {
        navigate('/configuracao')
    }

    function handleUsers() {
        navigate('/usuarios')
    }

    function changePassword() {
        navigate('/alterar-senha')
    }

    async function handleNotification() {
        if(loadingNotification){
            return
        }

        setLoadingNotification(true)

        await OneSignal.Slidedown.promptPush();

        try {
            await api.put(`/user/${username}/notification-config`, { notification: { subscriptionId: OneSignal.User.PushSubscription.id } })
            setLoadingNotification(false)
            alert('As notificações foram ativadas!')
        } catch (error: any) {
            alert(error.response.data.message)
            setLoadingNotification(false)
        }
    }

    async function getMyData(){
        try {
            const response = await api.get('/user/myself')
            setFormValues({
                name: response.data.name,
                phone: response.data.phone,
                pix: response.data.pix,
                profileImage: response.data.profileImage,
                location: response.data.location,
            })
            setUsername(response.data.user)
            setProfileImage(response.data.profileImage)
            setLoading(false)
        } catch (error: any) {
            alert(error.response.data.message)
        }
    }

    useEffect(() => {
        if(loading){
            getMyData()
        }
    })

    return (
        <Container>
            {loading ?
                <Loader size={70} biggestColor='green' smallestColor='gray' /> :
                <>
                    <ContainerProfileImage>
                        <ProfileImage src={profileImage}  />
                    </ContainerProfileImage>

                    <FormContainer>
                        
                        <label htmlFor="name">Nome:</label>
                        <BaseInput
                            type="text"
                            id="name"
                            placeholder="Informe o seu nome."
                            disabled
                            {...register('name')}
                        />

                        <label htmlFor="phone">Whatsapp:</label>
                        <BaseInput
                            type="text"
                            id="phone"
                            minLength={11}
                            maxLength={11}
                            placeholder="Informe o seu whatsapp."
                            disabled
                            {...register('phone')}
                        />

                        <label htmlFor="pix">Pix:</label>
                        <BaseInput
                            type="text"
                            id="pix"
                            placeholder="Informe o seu pix."
                            disabled
                            {...register('pix')}
                        />

                        <label htmlFor="profileImage">Link da imagem de perfil:</label>
                        <BaseInput
                            type="text"
                            id="profileImage"
                            placeholder="Informe o link da sua imagem."
                            disabled
                            {...register('profileImage')}
                        />

                        <label htmlFor="location">Link do google maps:</label>
                        <BaseInput
                            type="text"
                            id="location"
                            placeholder="Informe o link da localização."
                            disabled
                            {...register('location')}
                        />

                        <ContainerButtons>
                            {/* <SaveButton disabled={isSubmitDisabled} type="submit">Salvar</SaveButton> */}
                            <NotificationButton onClick={handleNotification} backgroundColor={'green-500'}>
                                {loadingNotification ?
                                    <Loader size={20} biggestColor='gray' smallestColor='gray' /> :
                                    "Ativar Notificações"    
                                }
                            </NotificationButton>
                            {permission === 'admin' &&
                                <>
                                    <NotificationButton onClick={handleConfig} backgroundColor={'gray-400'}>Configurações</NotificationButton>
                                    <NotificationButton onClick={handleUsers} backgroundColor={'gray-400'}>Usuários</NotificationButton>
                                </>
                            }
                            <ChangePasswordButton onClick={changePassword}>Trocar de senha</ChangePasswordButton>
                        </ContainerButtons>
                    </FormContainer>
                </>
            }
        </Container>
    )
}