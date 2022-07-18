import {
  Box,
  Button,
  Container, createTheme,
  CssBaseline,
  TextField,
  Typography
} from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import { loginStyles } from "../style/signin/SignIn";
import {getSHAOf, postToGateway} from "../others/utils";
import constants from "../others/constants";
import React, { useState } from "react";
import {useNavigate} from "react-router-dom";

const RecoverPassword = () => {
  const navigate = useNavigate();

  const [theme] = useState( createTheme() );

  const [password, setPassword] = useState("");

  const handlePasswordChange = (event) => {
    setPassword(event.target
                     .value);
  }

  const handleButton = async () => {
    const userId = window.location
        .href
        .split(constants.FORGOT_PASSWORD_URL + "/")[1];

    const requestBody = {
      password: getSHAOf( getSHAOf( password ) ),

      redirectTo: constants.USERS_HOST + constants.FORGOT_PASSWORD_URL
          + "/"
          + userId
    }

    const response = await postToGateway(requestBody);

    if (response.error !== undefined) {
      alert(response.error);
    } else {
      alert(response.result);

      navigate(constants.SIGN_IN_URL);
    }
  }

    return (
      <ThemeProvider theme={ theme }>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box sx={loginStyles.boxStyle}>
            <Typography component="h1" variant="h5"
            >Ingresá tu nueva contraseña
            </Typography>

            <div> <br /> </div>

            <Box component="form" noValidate sx={{ mt: 1 }}>
              <TextField
                onChange = { handlePasswordChange }
                value = { password }
                margin="normal"
                required
                fullWidth
                label="Nueva contraseña"
                name="password"
                type="password"
                autoFocus
              />

              <Button
                onClick={ handleButton }
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >Cambiar contraseña
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    );
}

export {
  RecoverPassword
};
