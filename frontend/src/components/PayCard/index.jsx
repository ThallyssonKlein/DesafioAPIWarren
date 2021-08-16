import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import FilledInput from '@material-ui/core/FilledInput';
import styles from './index.module.css';

import { PostPay } from '../../service/pay';

export default function PayCard({loadBalance}) {
  const [value, setValue] = useState(0);
  const [receiver, setReceiver] = useState('');

  async function handlePay() {
    const serviceResponse = await PostPay(value, receiver);

    if (serviceResponse) {
      alert('Pagamento feito com sucesso!');
      setValue(0);
      setReceiver('');
      loadBalance();
    } else {
      alert('Falha ao executar o pagamento!');
    }
  }

  return (
    <div className={styles.assetViewport}>
      <h3 className={styles.text}>Pagar</h3>
      <FilledInput
        placeholder="Código do recebedor"
        value={receiver}
        style={{ backgroundColor: 'white', flex: 1, marginBottom: 10 }}
        onChange={(e) => setReceiver(e.target.value)}
      />
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <FilledInput
          placeholder="Valor"
          type="number"
          value={value}
          style={{ backgroundColor: 'white', flex: 1 }}
          onChange={(e) => setValue(e.target.value)}
        />

        <Button
          variant="contained"
          onClick={() => handlePay()}
          style={{ color: 'white', marginLeft: 5 }}
          color="primary"
        >
          <b>Pagar</b>
        </Button>
      </div>

    </div>
  );
}
