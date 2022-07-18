import { Component } from 'react';
import { ThemeProvider } from "@emotion/react";
import { Container, createTheme, CssBaseline, Typography } from "@mui/material";
import constants from "../others/constants";
import {getToGateway} from "../others/utils";

class SignUpEnd extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.theme = createTheme();
    }

    async componentDidMount() {
        const userId = window.location
                             .href
                             .split(constants.SIGN_UP_END_URL + "/")[1];

        const response = await getToGateway(constants.USERS_HOST + constants.SIGN_UP_END_URL
                                    + "/"
                                    + userId, "");

        const message = response.error === undefined
                                    ? "Cuenta confirmada"
                                    : response.error;

        alert(message);

        this.props
            .navigate(constants.SIGN_IN_URL);
    }

    render() {
        return (
            <ThemeProvider theme={this.theme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                        <Typography component="h1"
                                    variant="h5"
                                    align={"center"}
                        > Un momento por favor...
                        </Typography>
                </Container>
            </ThemeProvider>
        )
    }
}

export {
    SignUpEnd
};
