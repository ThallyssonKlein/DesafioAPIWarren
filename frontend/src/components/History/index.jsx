import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { GetHistory } from '../../service/history';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function History() {
  const classes = useStyles();
  const [history, setHistory] = useState([]);

  function timeConverter(timestamp) {
    const a = new Date(timestamp);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();
    const hour = a.getHours();
    const min = a.getMinutes();
    const sec = a.getSeconds();
    const time = `${date} ${month} ${year} ${hour}:${min}:${sec}`;
    return time;
  }

  function mapHistoryToComponent(historyArray) {
    return historyArray.map((h) => (
      <TableRow key={`${h.date}`}>
        <TableCell component="th" scope="row">{h.operation}</TableCell>
        <TableCell align="right">{h.amount}</TableCell>
        <TableCell align="right">{timeConverter(h.date)}</TableCell>
        <TableCell align="right">{h.receiver}</TableCell>
      </TableRow>
    ));
  }

  useEffect(() => {
    (async () => {
      const serviceResponse = await GetHistory();
      const rows = mapHistoryToComponent(serviceResponse);
      setHistory(
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Operation</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Date</TableCell>
                <TableCell align="right">Receiver</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows}
            </TableBody>
          </Table>
        </TableContainer>,
      );
    })();
  }, []);

  return (
    <div>
      {(history) || 'Carregando seu extrato...'}
    </div>
  );
}
