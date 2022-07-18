const constants = require("../others/constants");

class WalletService {
    defineEvents(app) {
        app.post( constants.WALLET_URL,
            this.newWallet
                .bind(this) );
    }

    newWallet(req, res) {

    }
}

module.exports = WalletService;