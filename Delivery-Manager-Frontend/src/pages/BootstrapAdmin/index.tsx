/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';

import api from '../../services/api';
import { BaseButton, BaseInput, Container, FormContainer, Logo } from '../Login/styles';
import { Loader } from '../../components/Loader';

const schema = zod.object({
  name: zod.string().min(3, 'Informe o nome.'),
  phone: zod.string().min(10, 'Informe o WhatsApp.'),
  user: zod.string().min(3, 'Informe o usuário.'),
  password: zod.string().min(4, 'Informe a senha.'),
  pix: zod.string().min(3, 'Informe o pix.'),
});

type FormData = zod.infer<typeof schema>;

export function BootstrapAdmin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: 'Administrador',
      phone: '',
      user: 'admin',
      password: '123456',
      pix: '',
    },
  });

  const { handleSubmit, register, watch } = form;

  async function onSubmit(data: FormData) {
    if (loading) return;
    setLoading(true);
    try {
      await api.post('/user/bootstrap-admin', {
        ...data,
        phone: data.phone.replace(/\D/g, ''),
        type: 'admin',
        permission: 'master',
        profileImage: '',
        location: '',
      });
      alert('Primeiro administrador criado com sucesso! Agora faça login.');
      navigate('/');
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Erro ao criar administrador.');
    } finally {
      setLoading(false);
    }
  }

  const values = watch();
  const disabled = !values.name || !values.phone || !values.user || !values.password || !values.pix;

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer>
          <Logo src="https://i.pinimg.com/736x/a5/9f/17/a59f176343c6fd0d83adea72eaf0c57f.jpg" />
          <h2>Criar primeiro administrador</h2>
          <BaseInput type="text" placeholder="Nome" {...register('name')} />
          <BaseInput type="text" placeholder="WhatsApp" {...register('phone')} />
          <BaseInput type="text" placeholder="Usuário" {...register('user')} />
          <BaseInput type="password" placeholder="Senha" {...register('password')} />
          <BaseInput type="text" placeholder="Pix" {...register('pix')} />
        </FormContainer>
        <BaseButton disabled={disabled || loading} type="submit">
          {loading ? <Loader size={20} biggestColor='black' smallestColor='green' /> : 'Criar administrador'}
        </BaseButton>
      </form>
    </Container>
  );
}
