import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import FilledInput from '@material-ui/core/FilledInput';
import styles from './index.module.css';

import { PostWidhdraw } from '../../service/withdraw';

export default function WithDrawCard() {
  const [value, setValue] = useState(0);

  async function handleWidhtdraw() {
    const serviceResponse = await PostWidhdraw(value);

    if (serviceResponse) {
      alert('Saque feito com sucesso!');
      setValue(0);
    } else {
      alert('Falha ao executar o saque!');
    }
  }

  return (
    <div className={styles.assetViewport}>
      <h3 className={styles.text}>Sacar</h3>
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
          onClick={() => handleWidhtdraw()}
          style={{ color: 'white', marginLeft: 5 }}
          color="primary"
        >
          <b>Sacar</b>
        </Button>
      </div>

    </div>
  );
}
