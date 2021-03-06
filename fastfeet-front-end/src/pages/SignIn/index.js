import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as Yup from 'yup';

import { Input, Form } from '@rocketseat/unform';
import { signInRequest } from '~/store/modules/auth/actions';

import logo from '~/assets/logo.svg';

const schema = Yup.object().shape({
  email: Yup.string()
    .email('Insira um e-mail válido')
    .required('O e-mail é obrigatório'),
  password: Yup.string().required('A senha é obrigatória'),
});

export default function SignIn() {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.auth.loading);

  function handleSubmit({ email, password }) {
    dispatch(signInRequest(email, password));
  }

  return (
    <>
      <img src={logo} alt="Fastfeet" />
      <Form onSubmit={handleSubmit} schema={schema}>
        <strong>SEU E-MAIL</strong>
        <Input name="email" type="email" />

        <strong>SUA SENHA</strong>
        <Input name="password" type="password" />

        <button type="submit">
          {loading ? 'Carregando ...' : 'Entrar no Sistema'}
        </button>
      </Form>
    </>
  );
}
