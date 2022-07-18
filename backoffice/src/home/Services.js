import "../style/HomePageRoutes.css";
import {Box, Button, Modal, Table, TableBody, TableCell, TableRow, TextField} from '@mui/material';
import {DataGrid} from '@mui/x-data-grid';
import React, {useEffect, useState} from "react";
import {matrixStyles} from "../style/matrixStyles";
import { AdminSwitch } from "../components/AdminSwitch";

const constants = require("../others/constants");
const {postToGateway, getToGateway} = require("../others/utils");


const Services = (props) => {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [apiName, setApiName] = useState("");
  const [apiDescription, setApiDescription] = useState("");
  const [searchText, setSearchText] = useState("");
  const [addAdminModalVisible, setAddAdminModalVisible] = useState(false);

  const classes = matrixStyles();

  async function getServices() {
    let response = await getToGateway(constants.SERVICES_HOST + constants.SERVICES_URL,
      "?" + constants.API_KEY_QUERY_PARAM + constants.MY_API_KEY);

    if (response.error !== undefined) {
      response = []
    }

    return response;
  }

  // Component did mount
  useEffect(() => {
    document.body.style.backgroundColor = '#f9f6f4';

    const getServicesWrapper = async () => {
      const response = await getServices();
      setRows(response);
      setFilteredRows(response);
    };

    getServicesWrapper().then(r => r);
  }, []);

  async function addService(name, description) {
    if (name === "" || name === undefined || description === undefined) {
      alert("Por favor, complete los campos del nuevo servicio.");
      return;
    }
    const requestBody = {
      name: name,
      description: description,
      redirectTo: constants.SERVICES_HOST + constants.API_KEY_CREATE_SERVICE_URL
    }

    const response = await postToGateway(requestBody);

    if (response.error !== undefined) {
      alert(response.error);
    }
  }

  async function handleDisabledSwitch(checked, apiKey) {
    let url = constants.SERVICES_HOST + constants.API_KEY_DOWN_URL;
    if (checked) url = constants.SERVICES_HOST + constants.API_KEY_UP_URL;
    const requestBody = {
      apiKeyToChange: apiKey,
      redirectTo: url
    }
    const response = await postToGateway(requestBody);
    if (response.error !== undefined) {
      alert(response.error);
    }
  }

  const renderDisableButton = (params) => {
    return (
      <AdminSwitch
        initialState={params.row.active}
        itemId={params.row.apiKey}
        executeOnChange={handleDisabledSwitch}
        input={{'aria-label': 'controlled'}}
        defaultOn={false}
      />
    );
  }

  const handleApiName = (event) => {
    setApiName(event.target.value);
  }

  const handleApiDescription = (event) => {
    setApiDescription(event.target.value);
  }

  const handleSearchText = (event) => {
    const textInTextBox = event.target.value;

    setSearchText(textInTextBox);

    const lowerText = textInTextBox.toLowerCase();

    const newRows = rows.filter(row => {
      return Object.keys(row).some((field) => {
        return row[field].toString()
          .toLowerCase()
          .includes(lowerText);
      });
    });

    setFilteredRows(newRows);
  }

  const handlerModalOpen = () => setAddAdminModalVisible(true);
  const handlerModalClose = () => setAddAdminModalVisible(false);

  const columns = [
    {
      field: 'name',
      headerName: 'Nombre',
      headerClassName: classes.headerCell,
      flex: 0.33
    },
    {
      field: 'apiKey',
      headerName: 'API-KEY',
      headerClassName: classes.headerCell,
      flex: 1
    },
    {
      field: 'creationDate',
      headerName: 'Fecha de creación',
      headerClassName: classes.headerCell,
      flex: 0.30,
    },
    {
      field: 'description',
      headerName: 'Host',
      headerClassName: classes.headerCell,
      flex: 0.6
    },
    {
      field: 'active',
      headerName: 'Activado',
      headerClassName: classes.headerCell,
      renderCell: renderDisableButton,
      flex: 0.18
    }
  ];

  return (
    <div>
      <div>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell style={{width: 600}}>
                <TextField onChange={handleSearchText}
                           value={searchText}
                           margin="normal"
                           label="🔍"
                           style={{width: 500, backgroundColor: '#f5fcff', borderRadius: 5}}
                           size={"small"}
                           autoFocus>
                </TextField>
              </TableCell>
              <TableCell>
                <Button variant="contained" style={{float: 'right'}} onClick={handlerModalOpen}>
                  Agregar servicio
                </Button>
                <Modal
                  open={addAdminModalVisible}
                  onClose={handlerModalClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={{flexDirection: 'column', display: 'flex'}}
                       style={{
                         backgroundColor: 'white',
                         borderRadius: 10,
                         height: 200,
                         width: 400,
                         alignItems: 'center',
                         position: 'absolute',
                         top: '50%',
                         left: '50%',
                         transform: 'translate(-50%, -50%)',
                         border: '2px solid #000',
                         boxShadow: 100
                       }}>
                    <TextField onChange={handleApiName}
                               value={apiName}
                               margin="normal"
                               label="Nombre"
                               size="small"
                               style={{width: 300, marginTop: 25}}
                               autoFocus
                    >
                    </TextField>
                    <TextField onChange={handleApiDescription}
                               value={apiDescription}
                               margin="normal"
                               label="Host"
                               size="small"
                               style={{width: 300}}
                               autoFocus
                    >
                    </TextField>
                    <Button onClick={() => addService(apiName, apiDescription)} style={{width: 300, marginTop: 10}}>
                      Agregar servicio
                    </Button>
                  </Box>
                </Modal>
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
  Services
}
