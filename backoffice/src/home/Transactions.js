import "../style/HomePageRoutes.css";
import {Button, Table, TableBody, TableCell, TableRow, TextField} from '@mui/material';
import {DataGrid} from '@mui/x-data-grid';
import React, {useEffect, useState} from "react";
import {matrixStyles} from "../style/matrixStyles";
import {getToGateway, getUTCMinus3TimeStamp} from "../others/utils";
import {useNavigate} from "react-router-dom";

const constants = require("../others/constants");

const Transactions = (props) => {
  const [filteredRows, setFilteredRows] = useState([]);

  const navigate = useNavigate();

  const classes = matrixStyles();

  async function getTransactions() {
    let response = await getToGateway(constants.PAYMENTS_HOST + constants.DEPOSITS_URL);

    if (response.error !== undefined) {
      response = []
    }

    return response;
  }

  const getUserId = async (walletAddress)  => {
    return await getToGateway(constants.USERS_HOST + constants.USER_WITH_WALLET_URL
                            + "?"
                            + constants.WALLET_ID_PARAM
                            + walletAddress);
  }

  const getTransactionsWithUserId = async (transactions) => {
    return await Promise.all( transactions.map(async tx => {
      return {
        id: tx.id,
        hash: tx.id,
        timestamp: getUTCMinus3TimeStamp( new Date(tx.createdAt) ),
        wallet: tx.senderAddress,
        value: tx.amountSent,
        userId: ( await getUserId(tx.walletId) ).userId
      }
    } ) );
  }

  useEffect( () => {
    document.body.style.backgroundColor = '#f9f6f4';

    const getTransactionsWrapper = async () => {
      const response = await getTransactions();

      const formattedRows = await getTransactionsWithUserId(response);

      setFilteredRows(formattedRows);
    };

    getTransactionsWrapper().then(r => r);
  }, [] );

  const renderGoToProfileButton = (params) => {
    return (
        <Button style={{float: 'right'}} onClick={async () => {
          navigate(constants.PROFILE_URL + "/" + params.row.userId)
        }}> Ver usuario
        </Button>
      );
  }

  const columns = [
    {
      field: 'hash',
      headerName: 'Hash de transacción',
      headerClassName: classes.headerCell,
      flex: 0.7
    },
    {
      field: 'timestamp',
      headerName: 'Fecha y hora',
      headerClassName: classes.headerCell,
      flex: 0.3
    },
    {
      field: 'wallet',
      headerName: 'Billetera',
      headerClassName: classes.headerCell,
      flex: 0.5,
    },
    {
      field: 'value',
      headerName: 'Importe bruto [Kovan ETH]',
      headerClassName: classes.headerCell,
      flex: 0.5
    },
    {
      field: "user",
      headerName: "",
      headerClassName: classes.headerCell,
      flex: 0.3,
      renderCell: renderGoToProfileButton
    }
  ];

  return (
    <div>
      <div>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell style={{width: 600}}>
                <TextField margin="normal"
                           label="🔍"
                           style={{width: 500, backgroundColor: '#f5fcff', borderRadius: 5}}
                           size={"small"}
                           autoFocus>
                </TextField>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div style={{width: '100%', minHeight: window.innerHeight}}>
        <DataGrid
          rows={filteredRows}
          autoHeight={true}
          classes={{headerCell: classes.headerCell, row: classes.row}}
          columns={columns}/>
      </div>
    </div>
  );
}

export {
  Transactions
}
