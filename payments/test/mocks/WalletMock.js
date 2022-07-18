class WalletMock {
    constructor() {

    }

    get(arg) {
        return {
            id: 1
        }
    }
}

module.exports = {
    WalletMock
}
