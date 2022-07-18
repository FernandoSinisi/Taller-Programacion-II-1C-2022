const utils = require("../others/utils");
const Logger = require("./Logger");
const Wallets = require("../data/Wallet");
const ethers = require("ethers");
const config = require("../main/config");

async function newWallet(req, res) {
    Logger.request("Create new wallet.");
    const provider = new ethers.providers.InfuraProvider("kovan", config.infuraApiKey);
    // This may break in some environments, keep an eye on it
    const wallet = ethers.Wallet.createRandom().connect(provider);

    if (wallet === null || wallet === undefined) {
        Logger.error("Error to try create wallet.");
        utils.setErrorResponse("Error to try create wallet.", 500, res);
        return;
    }

    Logger.info("Wallet created")
    const balance = await wallet.getBalance();
    const saved = await Wallets.create({
        address: wallet.address,
        privateKey: wallet.privateKey,
        balance:balance.toNumber()
    }).catch(error => {
        Logger.error("Cannot save wallet: " + error.toString());
        utils.setErrorResponse("Error to try create wallet.", 500, res);
    });

    if (res.statusCode >= 400) {
        return;
    }

    Logger.info("Wallet saved")
    utils.setBodyResponse(saved, 200, res);
}

async function getWalletData(req, res) {
    Logger.info("Get wallet data with id:" + req.params.id)

    const wallet = await Wallets.findOne({
        attributes: ['id', 'address', 'privateKey', 'balance'],
        where: {
            id: req.params.id
        }
    }).catch(error => {
        Logger.error("Error in access to database" + error.toString());
        utils.setErrorResponse("Internal Server error", 500, res);
    });

    if (wallet === null || wallet === undefined) {
        Logger.error("Cannot get wallet with id:" + req.params.id);
        utils.setErrorResponse("Cannot find wallet with id: " + req.params.id, 400, res);
    }
    if (res.statusCode >= 400) {
        return;
    }
    Logger.info(`Wallet founded`);
    utils.setBodyResponse(wallet, 200, res);
}

async function getWalletsData(req, res) {
    Logger.info("Get all wallets")

    const wallets = await Wallets.findAll(
        {attributes: ['id', 'address', 'privateKey', 'balance']}
    ).catch(error => {
        Logger.error("Error in access to database" + error.toString());
        utils.setErrorResponse("Internal Server error", 500, res);
    });

    if (wallets === null || wallets === undefined) {
        Logger.error("Cannot get all wallets");
        utils.setErrorResponse("Cannot get all wallets", 500, res);
    }
    if (res.statusCode >= 400) {
        return;
    }
    Logger.info("wallets founded: " + wallets.length)
    utils.setBodyResponse(wallets, 200, res);
}

/*
const getDeployerWallet = () => () => {
    const provider = new ethers.providers.InfuraProvider(config.network, config.infuraApiKey);
    const wallet = ethers.Wallet.fromMnemonic(config.deployerMnemonic).connect(provider);
    Logger.info("Deployer wallet" + wallet.address);
    return wallet;
};*/

async function getWallet(walletId) {
    Logger.info(`Get wallet with id: ${walletId}`)

    const savedWallet = await Wallets.findOne({
        attributes: ['privateKey'],
        where: {
            id: walletId
        }
    })

    if (savedWallet === null || savedWallet === undefined) {
        Logger.error(`Cannot get wallet with id: ${walletId}`);
        return null;
    }
    const provider = new ethers.providers.InfuraProvider("kovan", config.infuraApiKey);
    return new ethers.Wallet(savedWallet.privateKey, provider);
}

const getWalletId = async (walletAddress) => {
    const savedWalletId = await Wallets.findOne({
        attributes: ['id'],
        where: {
            address: walletAddress
        }
    })

    if (savedWalletId === null || savedWalletId === undefined) {
        Logger.error(`Cannot get wallet with address: ${walletAddress}`);
        return null;
    }

    return savedWalletId.get({plain: true});
}

module.exports = {
    newWallet, getWalletData, getWalletsData, getWallet,
    getWalletId
};
