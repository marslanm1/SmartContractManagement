import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/MyATM.sol/MyATM.json"; // Change the imported ABI to match new contract name

export default function HomePage() {
    const [ethWallet, setEthWallet] = useState(undefined); // State to hold Ethereum wallet
    const [account, setAccount] = useState(undefined); // State to hold user account
    const [atm, setATM] = useState(undefined); // State to hold contract instance
    const [balance, setBalance] = useState(undefined); // State to hold ATM balance

    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Address of the deployed ATM contract
    const atmABI = atm_abi.abi; // ABI of the contract

    // Function to check for a connected Ethereum wallet
    const getWallet = async () => {
        if (window.ethereum) {
            setEthWallet(window.ethereum); // Set the Ethereum wallet
        }
        if (ethWallet) {
            const account = await ethWallet.request({ method: "eth_accounts" }); // Get connected accounts
            handleAccount(account); // Handle the account connection
        }
    };

    // Function to handle account connection
    const handleAccount = (account) => {
        if (account) {
            console.log("Account connected: ", account); // Log connected account
            setAccount(account); // Set account state
        } else {
            console.log("No account found"); // Log if no account is found
        }
    };

    // Function to connect to the user's account
    const connectAccount = async () => {
        if (!ethWallet) {
            alert('MetaMask wallet is required to connect'); // Alert if wallet is not installed
            return;
        }
        const accounts = await ethWallet.request({ method: 'eth_requestAccounts' }); // Request account access
        handleAccount(accounts); // Handle the account connection
        getATMContract(); // Get the contract instance
    };

    // Function to get the ATM contract instance
    const getATMContract = () => {
        const provider = new ethers.providers.Web3Provider(ethWallet); // Create a provider
        const signer = provider.getSigner(); // Get the signer
        const atmContract = new ethers.Contract(contractAddress, atmABI, signer); // Create the contract instance
        setATM(atmContract); // Set the contract state
    };

    // Function to get the balance of the ATM
    const getBalance = async () => {
        if (atm) {
            setBalance((await atm.getBalance()).toNumber()); // Get and set the balance
        }
    };

    // Function to deposit funds into the ATM
    const deposit = async () => {
        if (atm) {
            let tx = await atm.deposit(1); // Deposit 1 ETH
            await tx.wait(); // Wait for transaction to complete
            getBalance(); // Refresh balance
        }
    };

    // Function to withdraw funds from the ATM
    const withdraw = async () => {
        if (atm) {
            let tx = await atm.withdraw(1); // Withdraw 1 ETH
            await tx.wait(); // Wait for transaction to complete
            getBalance(); // Refresh balance
        }
    };

    // Function to initialize user interface elements
    const initUser = () => {
        if (!ethWallet) {
            return <p>Please install Metamask to use this ATM.</p>; // Alert if MetaMask is not installed
        }
        if (!account) {
            return <button onClick={connectAccount}>Please connect your Metamask wallet</button>; // Button to connect wallet
        }
        if (balance === undefined) {
            getBalance(); // Get balance if undefined
        }
        return (
            <div>
                <p>Your Account: {account}</p> // Display account
                <p>Your Balance: {balance}</p> // Display balance
                <button onClick={deposit}>Deposit 1 ETH</button> // Button to deposit
                <button onClick={withdraw}>Withdraw 1 ETH</button> // Button to withdraw
            </div>
        );
    };

    useEffect(() => { getWallet(); }, []); // Check wallet on component mount

    return (
        <main className="container">
            <header><h1>Welcome to the MyATM!</h1></header>
            {initUser()}
            <style jsx>{`
                .container {
                    text-align: center;
                }
            `}</style>
        </main>
    );
}
