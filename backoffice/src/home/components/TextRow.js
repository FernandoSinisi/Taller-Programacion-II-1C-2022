import {Typography} from "@mui/material";
import React from "react";

const TextRow = (props) => {
  return (
    <div>
      <Typography component="h1" variant={props.variant !== undefined ? props.variant : "h5"}>{props.text}
      </Typography>
      <div>
        <br/>
      </div>
    </div>
  );
};

export {
  TextRow
}
