const constants = require("../others/constants");

const RedirectToMetrics = () => {
    window.open(constants.DATADOG_DASHBOARD_URL);
    return null;
}

export {
    RedirectToMetrics
}
