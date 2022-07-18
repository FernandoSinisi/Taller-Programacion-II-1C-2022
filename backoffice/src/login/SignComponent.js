import { createTheme } from "@mui/material";
import { Component, createRef } from "react";

class SignComponent extends Component {
  constructor(props) {
    super(props);

    this.theme = createTheme();

    this.emailReference = createRef();

    this.passwordReference = createRef();
  }

  handleEmailChange(event) {
    this.emailReference
      .current = event.target
      .value;
  }

  handlePasswordChange(event) {
    this.passwordReference
      .current = event.target
      .value;
  }
}

export {
  SignComponent
};
