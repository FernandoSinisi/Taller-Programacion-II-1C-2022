import {
  Grid,
  TextField,
  Button,
  Link,
  Container,
  CssBaseline,
  Box,
  createTheme,
} from "@mui/material";
import { loginStyles } from "../style/signin/SignIn";
import { ThemeProvider } from "@emotion/react";
import logo from "../media/logo.png";
import constants from "../others/constants";
import { useEffect, useState } from "react";
import { areAnyUndefined, getSHAOf, postToGateway } from "../others/utils";
import { auth } from "../services/FirebaseService";
import { useNavigate } from "react-router-dom";
import { useContext } from "../services/AuthContext";
const firebaseAuth = require("firebase/auth");

const SignIn = (props) => {
  const navigate = useNavigate();

  const [theme] = useState(createTheme());

  const { saveToken } = useContext();

  const [emailReference, setEmailReference] = useState("");

  const [passwordReference, setPasswordReference] = useState("");

  useEffect(() => {
    document.body.style.backgroundColor = "#ffffff";
  }, []);

  const handleEmailChange = (event) => {
    setEmailReference(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPasswordReference(event.target.value);
  };

  async function handleSignIn() {
    if (areAnyUndefined([emailReference, passwordReference])) {
      alert("Por favor complete todos los campos.");

      return;
    }

    const password = getSHAOf(getSHAOf(passwordReference));

    const response = await firebaseAuth
      .signInWithEmailAndPassword(auth, emailReference, password)
      .catch((error) => {
        return error.toString();
      });

    if (response.user === undefined) {
      alert("No se encontro ningun usuario con ese mail y/ o contraseña");

      return;
    }
    const idToken = await auth.currentUser.getIdToken();

    const requestBody = {
      email: emailReference,

      password: password,

      idToken: idToken,

      link: "web",

      redirectTo: constants.USERS_HOST + constants.SIGN_IN_URL,
    };

    const gatewayResponse = await postToGateway(requestBody);

    if (gatewayResponse.error !== undefined) {
      alert(gatewayResponse.error);
    } else {
      saveToken(idToken);

      navigate(constants.USERS_URL);
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={loginStyles.boxStyle}>
          <img src={logo} alt={"logo"} />

          <div>
            <br />
            <br />
          </div>

          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              onChange={handleEmailChange}
              value={emailReference}
              margin="normal"
              required
              fullWidth
              label="Correo"
              name="email"
              autoFocus
            />

            <TextField
              onChange={handlePasswordChange}
              value={passwordReference}
              margin="normal"
              required
              fullWidth
              name="password-field"
              label="Contraseña"
              type="password"
            />

            <Button
              onClick={handleSignIn}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Ingresar
            </Button>

            <Grid container>
              <Grid item xs>
                <Link href={constants.FORGOT_PASSWORD_URL} variant="body2">
                  Reestablecer contraseña
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export { SignIn };
