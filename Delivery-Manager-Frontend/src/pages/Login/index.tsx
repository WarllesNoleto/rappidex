/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import * as zod from 'zod';
import { useForm } from 'react-hook-form';
import { SignIn } from 'phosphor-react';

import { DeliveryContext } from '../../context/DeliveryContext';
import { BaseButton, BaseInput, Container, FormContainer, Logo } from './styles';
import { Loader } from '../../components/Loader';

import api from '../../services/api';
import OneSignal from 'react-onesignal';

const newLoginFormValidationSchema = zod.object({
  user: zod.string().min(3, 'Informe o usuario.'),
  password: zod.string().min(4, 'Informe a senha.'),
});

type NewLoginFormData = zod.infer<typeof newLoginFormValidationSchema>;

export function Login() {
  const { login } = useContext(DeliveryContext);
  const navigate = useNavigate();

  const newLoginFormData = useForm<NewLoginFormData>({
    resolver: zodResolver(newLoginFormValidationSchema),
    defaultValues: {
      user: '',
      password: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const { handleSubmit, watch, reset, register } = newLoginFormData;

  async function runOneSignal(username: string, token: string) {
    try {
      api.defaults.headers.Authorization = `Bearer ${token}`;

      if (
        OneSignal &&
        OneSignal.User &&
        OneSignal.User.PushSubscription &&
        OneSignal.User.PushSubscription.id
      ) {
        await api.put(`/user/${username}/notification-config`, {
          notification: {
            subscriptionId: OneSignal.User.PushSubscription.id,
          },
        });
        return;
      }

      if (OneSignal?.Slidedown?.promptPush) {
        await OneSignal.Slidedown.promptPush();
      }

      await api.put(`/user/${username}/notification-config`, {
        notification: {
          subscriptionId: OneSignal?.User?.PushSubscription?.id || '',
        },
      });
    } catch (error) {
      console.log('OneSignal falhou, mas o login continua normal.', error);
    }
  }

  async function handleLogin(data: NewLoginFormData) {
    if (loading) return;

    setLoading(true);

    try {
      const response = await api.post('/auth', data);

      login(response.data.token, response.data.permission);
      api.defaults.headers.Authorization = `Bearer ${response.data.token}`;

      reset();
      navigate('/');

      runOneSignal(data.user, response.data.token);

      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      alert(error?.response?.data?.message || 'Erro ao fazer login');
    }
  }

  const user = watch('user');
  const password = watch('password');
  const isSubmitDisabled = !user || !password;

  return (
    <Container>
      <form onSubmit={handleSubmit(handleLogin)} action="">
        <FormContainer>
          <Logo src="https://i.pinimg.com/736x/a5/9f/17/a59f176343c6fd0d83adea72eaf0c57f.jpg" />
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
          {!loading ? (
            <>
              <SignIn size={24} /> Login
            </>
          ) : (
            <Loader size={20} biggestColor="black" smallestColor="green" />
          )}
        </BaseButton>
      </form>
    </Container>
  );
}