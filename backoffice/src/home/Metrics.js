import React from "react";
import {DATADOG_DASHBOARD_URL} from "../others/constants";

const Metrics = () => {
    return (
      <div>
          {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
          <iframe width="100%"
                  height={window.outerHeight}
                  src={DATADOG_DASHBOARD_URL}>
          </iframe>
      </div>
    );
}

export {
    Metrics
}
