import React, { useState, useEffect } from 'react';
import Cookies from 'cookies';
import Button from '@material-ui/core/Button';
import Modal from 'react-modal';
import DepositCard from '../components/DepositCard';
import WithDrawCard from '../components/WithdrawCard';
import PayCard from '../components/PayCard';
import styles from './index.module.css';
import { GetBalance } from '../service/balance';
import History from '../components/History';
import { deleteAccessToken } from '../service/cookies';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [balance, setBalance] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const serviceResponse = await GetBalance();
      setBalance(serviceResponse.balance);
    })();
  }, []);

  function openModal() {
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  return (
    <div>
      <div className={styles.header}>
        <h1>
          Saldo:
          {(` ${balance}`) || ' ...carregando'}
        </h1>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Button
            variant="contained"
            onClick={() => openModal()}
            style={{ color: 'white', marginLeft: 5 }}
            color="primary"
          >
            <b>Ver extrato</b>
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              router.push('/login');
              deleteAccessToken();
            }}
            style={{ color: 'white', marginLeft: 5 }}
            color="primary"
          >
            <b>Deslogar</b>
          </Button>
        </div>
      </div>
      <div className={styles.viewport}>
        <DepositCard />
        <WithDrawCard />
        <PayCard />
      </div>

      <Modal
        isOpen={modalIsOpen}
        contentLabel="Extrato"
      >
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <h2 style={{ fontFamily: 'Arial, sans-serif' }}>Extrato</h2>
          <Button
            variant="contained"
            onClick={() => closeModal()}
            style={{ color: 'white', marginLeft: 5 }}
            color="primary"
          >
            <b>X</b>
          </Button>
        </div>
        <History />
      </Modal>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const { req, res } = ctx;
  const cookies = new Cookies(req, res);

  if (!cookies.get('x-access-token') || cookies.get('x-access-token') === 'false') {
    return {
      redirect: { destination: '/login', permanent: true },
    };
  }
  return { props: {} };
}
