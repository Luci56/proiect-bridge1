
//debugger;




const statusDiv = document.getElementById('status');

// Conectare MetaMask (Ethereum)
const ethButton = document.getElementById('connect-eth');
let ethAccounts = [];

ethButton.addEventListener('click', async () => {
    debugger;
    console.log("ethButtonClick")
    if (typeof window.ethereum !== 'undefined') {
        console.log("MetaMask detected. Attempting connection...");
        try {
            ethAccounts = await ethereum.request({ method: 'eth_requestAccounts' });
            if (ethAccounts.length > 0) {
                console.log("Connected to Ethereum! Address:", ethAccounts[0]);
                statusDiv.innerHTML = `Connected to Ethereum! Address: ${ethAccounts[0]}`;
            } else {
                console.error("No accounts found.");
                alert("No accounts available in MetaMask.");
            }
        } catch (error) {
            console.error("Error connecting to MetaMask:", error);
            alert("Failed to connect to MetaMask. Check console for details.");
        }
    } else {
        alert("MetaMask is not detected. Please install it to continue.");
        console.error("MetaMask not detected.");
    }
});

// Conectare Sui Wallet
const suiButton = document.getElementById('connect-sui');
let suiProvider;

suiButton.addEventListener('click', async () => {
    try {
        const provider = new JsonRpcProvider();

        // Verificare adrese
        const suiWallets = await provider.getWallets();
        if (!suiWallets || suiWallets.length === 0) {
            throw new Error("No Sui wallets found. Please install a Sui-compatible wallet.");
        }

        suiProvider = suiWallets[0];
        await suiProvider.connect();
        const accounts = await suiProvider.getAccounts();
        console.log(`Connected to Sui Wallet: ${accounts[0]}`);
        statusDiv.innerHTML += `<br>Connected to Sui! Address: ${accounts[0]}`;
    } catch (error) {
        console.error("Error connecting to Sui wallet:", error);
        statusDiv.innerHTML += "<br>Failed to connect to Sui wallet.";
    }
});

// Mint on Ethereum
const mintEthButton = document.getElementById('mint-eth');
mintEthButton.addEventListener('click', async () => {
    if (ethAccounts.length === 0) {
        alert("Connect to Ethereum wallet first!");
        return;
    }
    try {
        console.log("Minting tokens on Ethereum...");
        const tx = await ethereum.request({
            method: 'eth_sendTransaction',
            params: [{
                from: ethAccounts[0],
                to: "0xYourContractAddress", // Înlocuiește cu adresa contractului tău
                data: "0xMintFunctionData", // Înlocuiește cu datele funcției de mint
            }]
        });
        console.log("Transaction successful:", tx);
    } catch (error) {
        console.error("Error minting on Ethereum:", error);
    }
});

// Burn on Ethereum
const burnEthButton = document.getElementById('burn-eth');
burnEthButton.addEventListener('click', async () => {
    if (ethAccounts.length === 0) {
        alert("Connect to Ethereum wallet first!");
        return;
    }
    try {
        console.log("Burning tokens on Ethereum...");
        const tx = await ethereum.request({
            method: 'eth_sendTransaction',
            params: [{
                from: ethAccounts[0],
                to: "0xYourContractAddress", // Înlocuiește cu adresa contractului tău
                data: "0xBurnFunctionData", // Înlocuiește cu datele funcției de burn
            }]
        });
        console.log("Transaction successful:", tx);
    } catch (error) {
        console.error("Error burning on Ethereum:", error);
    }
});

// Bridge Tokens
const bridgeButton = document.getElementById('bridge');
bridgeButton.addEventListener('click', async () => {
    const amount = prompt("Enter amount to bridge:");
    const direction = prompt("Bridge direction (eth-to-sui or sui-to-eth):");

    if (direction === "eth-to-sui") {
        console.log("Burning on Ethereum...");
        try {
            const burnTx = await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: ethAccounts[0],
                    to: "0xYourContractAddress", // Înlocuiește cu adresa contractului tău
                    data: "0xBurnFunctionData", // Înlocuiește cu datele funcției de burn
                }]
            });
            console.log("Burn transaction successful on Ethereum:", burnTx);
        } catch (error) {
            console.error("Error burning on Ethereum:", error);
        }

        console.log("Minting on Sui...");
        try {
            console.log(`Minting ${amount} tokens on Sui...`);
            // Implement mint logic on Sui here
        } catch (error) {
            console.error("Error minting on Sui:", error);
        }
    } else if (direction === "sui-to-eth") {
        console.log("Burning on Sui...");
        try {
            console.log(`Burning ${amount} tokens on Sui...`);
            // Implement burn logic on Sui here
        } catch (error) {
            console.error("Error burning on Sui:", error);
        }

        console.log("Minting on Ethereum...");
        try {
            const mintTx = await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: ethAccounts[0],
                    to: "0xYourContractAddress", // Înlocuiește cu adresa contractului tău
                    data: "0xMintFunctionData", // Înlocuiește cu datele funcției de mint
                }]
            });
            console.log("Mint transaction successful on Ethereum:", mintTx);
        } catch (error) {
            console.error("Error minting on Ethereum:", error);
        }
    } else {
        alert("Invalid direction. Use 'eth-to-sui' or 'sui-to-eth'.");
    }
});
