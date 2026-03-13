/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom';
import * as zod from 'zod'
import { useForm } from 'react-hook-form'
import { SignIn  } from 'phosphor-react'

import { DeliveryContext } from '../../context/DeliveryContext';
import { BaseButton, BaseInput, Container, FormContainer, Logo } from "./styles";
import { Loader } from '../../components/Loader';

import api from '../../services/api';
import OneSignal from 'react-onesignal';
// import OneSignal from 'react-onesignal';

const newLoginFormValidationSchema = zod.object({
    user: zod.string().min(3,'Informe o usuario.'),
    password: zod
      .string()
      .min(4, 'Informe a senha.'),
  })

type NewLoginFormData = zod.infer<typeof newLoginFormValidationSchema>

export function Login() {

    const { login } = useContext(DeliveryContext)
    const navigate = useNavigate()
    const newLoginFormData = useForm<NewLoginFormData>({
        resolver: zodResolver(newLoginFormValidationSchema),
        defaultValues: {
            user: '',
            password: '',
        },
    })

    const [loading, setLoading] = useState(false)

    const { handleSubmit, watch, reset, register } = newLoginFormData

    async function runOneSignal(username: string, token: string){
        api.defaults.headers.Authorization = `Bearer ${token}`
        // console.log(OneSignal)
        if(OneSignal && OneSignal.User && OneSignal.User.PushSubscription && OneSignal.User.PushSubscription.id){
            await api.put(`/user/${username}/notification-config`, { notification: { subscriptionId: OneSignal.User.PushSubscription.id } })
            return
        }
        await OneSignal.Slidedown.promptPush();
        await api.put(`/user/${username}/notification-config`, { notification: { subscriptionId: OneSignal.User.PushSubscription.id } })
    }

    // async function configureNotification(user: string, token: string){
    //     console.log({
    //         teste: 'novo mensageiro',
    //         user,
    //     })
    //     navigator.serviceWorker.register('service-worker.js').then(async serviceWorker => {
    //         api.defaults.headers.Authorization = `Bearer ${token}`
    //         // let subscription = await serviceWorker.pushManager.
    //         const publicKey = 'BAGRiJjxkVtCYwNHdUM9amJDdXecxMK73KLZQgEOUrT7sDMvcROMxA5Utzsbx1noeFOZz8R9yu7U3_1nuCfcQDY';
    //         const subscription = await serviceWorker.pushManager.subscribe({
    //           userVisibleOnly: true,
    //           applicationServerKey: publicKey,
    //         })
    //         // if (!subscription){
    //         // }

    //         console.log(subscription)

    //         await api.put(`/user/${user}/notification-config`, { notification: subscription })
    //       })
    // }

    async function handleLogin(data: NewLoginFormData) {
        if(loading) {
            return
        }

        setLoading(true)
        try {
            const reponse = await api.post('/auth', data)
            login(reponse.data.token, reponse.data.permission)
            console.log({data: "run onesignal with", user: data.user, token: reponse.data.token})
            await runOneSignal(data.user, reponse.data.token)
            // await configureNotification(data.user, reponse.data.token)
            reset()
            navigate('/')
            setLoading(false)
        } catch (error: any) {
            setLoading(false)
            alert(error.response.data.message)
        }
    }

    const user = watch('user')
    const password = watch('password')
    const isSubmitDisabled = !user || !password

    return (
        <Container> 
            <form onSubmit={handleSubmit(handleLogin)} action="">
                <FormContainer>
                    <Logo src="https://i.pinimg.com/736x/a5/9f/17/a59f176343c6fd0d83adea72eaf0c57f.jpg"  />
                    <BaseInput
                        type="text"
                        id="user"
                        placeholder="Informe o usuário."
                        {...register('user')}
                    />

                    <BaseInput
                        type="password"
                        id="password"
                        placeholder="Informe a senha."
                        {...register('password')}
                    />
                </FormContainer>

                <BaseButton disabled={isSubmitDisabled} type="submit">
                    { !loading ?
                        <>
                            <SignIn size={24} /> Login 
                        </> :
                        <Loader size={20} biggestColor='black' smallestColor='green' />
                    }
                </BaseButton>
            </form>
        </Container>
    )
}