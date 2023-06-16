// Import Solana web3 functionalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL
} = require("@solana/web3.js");
const prompt = require('prompt-sync')({sigint: true});

// Create a new keypair
const newPair = new Keypair();

// Extract the public and private key from the keypair
const publicKey = new PublicKey(newPair._keypair.publicKey).toString();
const privateKey = newPair._keypair.secretKey;
console.log("New Public Key: ", publicKey);

// Connect to the Devnet

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Get the wallet balance from a given private key
const getWalletBalance = async (chosenPublicKey = "") => {
    try {
        // Connect to the Devnet
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        // console.log("Connection object is:", connection);

        if (chosenPublicKey.length>1) {
            // Make a wallet (keypair) from privateKey and get its balance
            const walletBalance = await connection.getBalance(
                new PublicKey(chosenPublicKey)
            );
            console.log(`Balance of ${chosenPublicKey} : ${parseInt(walletBalance) / LAMPORTS_PER_SOL} SOL`);
        } else {
            // Make a wallet (keypair) from privateKey and get its balance
            const myWallet = await Keypair.fromSecretKey(privateKey);
            const walletBalance = await connection.getBalance(
                new PublicKey(newPair.publicKey)
            );
            console.log(`Balance of ${newPair.publicKey} : ${parseInt(walletBalance) / LAMPORTS_PER_SOL} SOL`);
        }
    } catch (err) {
        console.log(err);
    }
};

const airDropSol = async (chosenPublicKey = "") => {
    try {
        // Connect to the Devnet
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        if (chosenPublicKey.length>1) {
            // Airdrop to user specified wallet
            console.log("Airdropping some SOL to my wallet!");
            const fromAirDropSignature = await connection.requestAirdrop(
                new PublicKey(chosenPublicKey),
                2 * LAMPORTS_PER_SOL
            );
            await connection.confirmTransaction(fromAirDropSignature);
        } else {
            // Airdrop to wallet from privateKey
            const myWallet = await Keypair.fromSecretKey(privateKey);
            // Request airdrop of 2 SOL to the wallet
            console.log("Airdropping some SOL to my wallet!");
            const fromAirDropSignature = await connection.requestAirdrop(
                new PublicKey(myWallet.publicKey),
                2 * LAMPORTS_PER_SOL
            );
            await connection.confirmTransaction(fromAirDropSignature);
        }
    } catch (err) {
        console.log(err);
    }
};

// Show the wallet balance before and after airdropping SOL
const mainFunction = async () => {
    const userPubKey = prompt('Enter your public key for the airdrop: \n');
    await getWalletBalance(userPubKey);
    await airDropSol(userPubKey);
    await getWalletBalance(userPubKey);
}

mainFunction();
