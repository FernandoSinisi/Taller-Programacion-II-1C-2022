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
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  const [theme] = useState( createTheme() );

  const [emailReference, setEmailReference] = useState("");

  const [passwordReference, setPasswordReference] = useState("");

  const handleEmailChange = (event) => {
    setEmailReference(event.target
                           .value);
  }

  const handlePasswordChange = (event) => {
    setPasswordReference(event.target
                              .value);
  }

  const handleSignUp = async () => {
    if (passwordReference.length < constants.PASSWORD_MIN_LEN) {
      alert("La contraseña debe tener al menos 10 caracteres;");
      return;
    }

    const password = (passwordReference === "")
                      ? ""
                      : getSHAOf( getSHAOf( passwordReference ) );

    const requestBody = {
      email: emailReference,

      password: password,

      link: "web",

      isExternal: false,

      redirectTo: constants.USERS_HOST + constants.SIGN_UP_URL,
    }

    const gatewayResponse = await postToGateway(requestBody);

    if (gatewayResponse.error !== undefined) {
      alert(gatewayResponse.error);
    } else {
      alert("Mail enviado a tu cuenta.");

      navigate(constants.SIGN_IN_URL);
    }
  }

    return (
      <ThemeProvider theme={ theme }>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box sx={loginStyles.boxStyle}>
            <Typography component="h1" variant="h5"
            >Registrarse
            </Typography>

            <div> <br /> </div>

            <Box component="form" noValidate sx={{ mt: 1 }}>
              <TextField
                onChange = { handleEmailChange }
                value = { emailReference }
                margin="normal"
                required
                fullWidth
                label="Correo"
                name="email"
                autoComplete="email"
                autoFocus
              />

              <TextField
                onChange = { handlePasswordChange }
                value = { passwordReference }
                margin="normal"
                required
                fullWidth
                name="password-field"
                label="Contraseña"
                type="password"
                autoComplete="current-password"
              />

              <Button
                onClick={ handleSignUp }
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >Registrarse
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    );
}

export {
  SignUp
};
