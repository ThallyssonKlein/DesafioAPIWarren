import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Button from '@material-ui/core/Button';
import FilledInput from '@material-ui/core/FilledInput';
import Head from 'next/head';
import Cookies from 'cookies';
import Modal from 'react-modal';

import { Login as LoginService } from '../service/auth';
import { PostUser } from '../service/user';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [name, setName] = useState('');
  const [emailCreateAccount, setEmailCreateAccount] = useState('');
  const [cpf, setCpf] = useState('');
  const [passwordCreateAccount, setPasswordCreateAccount] = useState('');

  function openModal() {
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  async function handleLogin() {
    const serviceResponse = await LoginService(email, password);

    if (serviceResponse) {
      setEmail('');
      setPassword('');
      router.push('/');
    } else {
      alert('Email ou senha incorretos!');
    }
  }

  async function handleCreateAccount() {
    const serviceResponse = await PostUser(name, emailCreateAccount, cpf, passwordCreateAccount);

    if (serviceResponse) {
      setName('');
      setEmailCreateAccount('');
      setCpf('');
      setPasswordCreateAccount('');
      closeModal();
      router.push('/');
    } else {
      alert('Preecha todos os campos por favor!');
    }
  }

  return (
    <div>
      <Head>
        <title>Login</title>
      </Head>
      <div className="viewport" style={{ backgroundImage: 'url(/img-bg-login.jpg)' }}>
        <div className="col">
          <img src="https://via.placeholder.com/150" alt="Login logo" />
          <FilledInput
            placeholder="Email"
            style={{ backgroundColor: 'white' }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div style={{ marginTop: 10 }}>
            <FilledInput
              placeholder="Senha"
              type="password"
              value={password}
              style={{ backgroundColor: 'white' }}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="row" style={{ marginTop: 10, marginBottom: 30 }}>
            <Button
              variant="contained"
              onClick={() => handleLogin()}
              style={{ color: 'white', flex: 1 }}
              color="primary"
            >
              <b>Acessar</b>
            </Button>
          </div>
          <div className="row" style={{ marginTop: 10, marginBottom: 30 }}>
            <Button
              variant="contained"
              onClick={() => openModal()}
              style={{ color: 'white', flex: 1 }}
              color="primary"
            >
              <b>Criar conta</b>
            </Button>
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        contentLabel="Criar conta"
      >
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <h2 style={{ fontFamily: 'Arial, sans-serif' }}>Criar conta</h2>
          <Button
            variant="contained"
            onClick={() => closeModal()}
            style={{ color: 'white', marginLeft: 5 }}
            color="primary"
          >
            <b>X</b>
          </Button>
        </div>
        <div className="viewport" style={{ backgroundImage: 'url(/img-bg-login.jpg)' }}>
          <div className="col">
            <FilledInput
              placeholder="Nome"
              style={{ backgroundColor: 'white' }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div style={{ marginTop: 10 }}>
              <FilledInput
                placeholder="Email"
                style={{ backgroundColor: 'white' }}
                value={emailCreateAccount}
                onChange={(e) => setEmailCreateAccount(e.target.value)}
              />
            </div>
            <div style={{ marginTop: 10 }}>
              <FilledInput
                placeholder="Cpf"
                style={{ backgroundColor: 'white' }}
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
            </div>
            <div style={{ marginTop: 10 }}>
              <FilledInput
                placeholder="Senha"
                type="password"
                value={passwordCreateAccount}
                style={{ backgroundColor: 'white' }}
                onChange={(e) => setPasswordCreateAccount(e.target.value)}
              />
            </div>
            <div className="row" style={{ marginTop: 10, marginBottom: 30 }}>
              <Button
                variant="contained"
                onClick={() => handleCreateAccount()}
                style={{ color: 'white', flex: 1 }}
                color="primary"
              >
                <b>Salvar</b>
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  const { req, res } = ctx;
  const cookies = new Cookies(req, res);

  if (cookies.get('x-access-token') && cookies.get('x-access-token') !== 'false') {
    return {
      redirect: { destination: '/', permanent: true },
    };
  }
  return {
    props: {},
  };
};
