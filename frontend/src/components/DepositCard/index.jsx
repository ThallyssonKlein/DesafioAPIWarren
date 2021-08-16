import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import FilledInput from '@material-ui/core/FilledInput';
import styles from './index.module.css';

import { PostDeposit } from '../../service/deposit';

export default function DepositCard() {
  const [value, setValue] = useState(0);

  async function handleDeposit() {
    const serviceResponse = await PostDeposit(value);

    if (serviceResponse) {
      alert('Depósito feito com sucesso!');
      setValue(0);
    } else {
      alert('Falha ao fazer o depósito!');
    }
  }

  return (
    <div className={styles.assetViewport}>
      <h3 className={styles.text}>Depositar</h3>
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
          onClick={() => handleDeposit()}
          style={{ color: 'white', marginLeft: 5 }}
          color="primary"
        >
          <b>Depositar</b>
        </Button>
      </div>

    </div>
  );
}
