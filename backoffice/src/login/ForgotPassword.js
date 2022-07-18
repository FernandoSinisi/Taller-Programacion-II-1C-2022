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
import constants from "../others/constants";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {postToGateway} from "../others/utils";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [theme] = useState( createTheme() );

  const [emailReference, setEmailReference] = useState("");

  const handleEmailChange = (event) => {
    setEmailReference(event.target
                           .value);
  }

  const handleButton = async () => {
    const requestBody = {
      email: emailReference,

      link: "web",

      redirectTo: constants.USERS_HOST + constants.FORGOT_PASSWORD_URL,
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
            >Ingresá tu cuenta de correo
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

              <Button
                onClick={ handleButton }
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >Recuperar cuenta
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    );
}

export {
  ForgotPassword
};
