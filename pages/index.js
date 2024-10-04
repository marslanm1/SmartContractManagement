import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/MyATM.sol/MyATM.json";

export default function HomePage() {
    const [ethWallet, setEthWallet] = useState(undefined);
    const [account, setAccount] = useState(undefined);
    const [atm, setATM] = useState(undefined);
    const [balance, setBalance] = useState(undefined);
    const [userBalance, setUserBalance] = useState(undefined);
    const [depositAmount, setDepositAmount] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("");

    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const atmABI = atm_abi.abi;

    const getWallet = async () => {
        if (window.ethereum) {
            setEthWallet(window.ethereum);
        }
        if (ethWallet) {
            const account = await ethWallet.request({ method: "eth_accounts" });
            handleAccount(account);
        }
    };

    const handleAccount = (account) => {
        if (account) {
            console.log("Account connected: ", account);
            setAccount(account[0]);
        } else {
            console.log("No account found");
        }
    };

    const connectAccount = async () => {
    if (!ethWallet) {
        alert("MetaMask wallet is required to connect");
        return;
    }
    try {
        const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
        handleAccount(accounts);
        getATMContract();
    } catch (error) {
        console.error("Error connecting MetaMask: ", error);
        alert("Could not connect to MetaMask. Please try again.");
    }
};


    const getATMContract = () => {
        const provider = new ethers.providers.Web3Provider(ethWallet);
        const signer = provider.getSigner();
        const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
        setATM(atmContract);
    };

    const getBalance = async () => {
        if (atm) {
            setBalance((await atm.getBalance()).toNumber());
            setUserBalance((await atm.getUserBalance(account)).toNumber());
        }
    };

    const deposit = async () => {
        if (atm) {
            let tx = await atm.deposit({ value: ethers.utils.parseEther(depositAmount) });
            await tx.wait();
            getBalance();
            setDepositAmount("");
        }
    };

    const withdraw = async () => {
        if (atm) {
            let tx = await atm.withdraw(ethers.utils.parseEther(withdrawAmount));
            await tx.wait();
            getBalance();
            setWithdrawAmount("");
        }
    };

    const initUser = () => {
        if (!ethWallet) {
            return <p>Please install MetaMask to use this ATM.</p>;
        }
        if (!account) {
            return <button className="connect-btn" onClick={connectAccount}>Connect MetaMask Wallet</button>;
        }
        if (balance === undefined) {
            getBalance();
        }
        return (
            <div className="dashboard">
                <div className="card">
                    <h2>Your Account</h2>
                    <p className="account">{account}</p>
                </div>
                <div className="card">
                    <h2>ATM Balance</h2>
                    <p className="balance">{balance} ETH</p>
                    <div className="progress-bar">
                        <div className="progress" style={{ width: `${balance}%` }}></div>
                    </div>
                </div>
                <div className="card">
                    <h2>Your Balance</h2>
                    <p className="user-balance">{userBalance} ETH</p>
                    <div className="progress-bar">
                        <div className="progress" style={{ width: `${userBalance}%` }}></div>
                    </div>
                </div>
                <div className="actions">
                    <div className="input-group">
                        <input
                            type="number"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                            placeholder="Amount to Deposit"
                        />
                        <button className="action-btn" onClick={deposit}>Deposit</button>
                    </div>
                    <div className="input-group">
                        <input
                            type="number"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            placeholder="Amount to Withdraw"
                        />
                        <button className="action-btn" onClick={withdraw}>Withdraw</button>
                    </div>
                </div>
            </div>
        );
    };

    useEffect(() => {
        getWallet();
    }, []);

    return (
        <main className="container">
            <header><h1>Welcome to MyATM!</h1></header>
            {initUser()}
            <style jsx>{`
                .container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    font-family: Arial, sans-serif;
                    background: linear-gradient(to bottom right, #f8fafc, #d1e8ff);
                    height: 100vh;
                    justify-content: center;
                    text-align: center;
                }
                header {
                    margin-bottom: 20px;
                }
                .dashboard {
                    display: grid;
                    gap: 20px;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    width: 80%;
                    max-width: 1200px;
                }
                .card {
                    background: #ffffff;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    padding: 20px;
                    transition: transform 0.3s ease;
                }
                .card:hover {
                    transform: scale(1.05);
                }
                .progress-bar {
                    background: #e0e0e0;
                    border-radius: 5px;
                    height: 20px;
                    overflow: hidden;
                }
                .progress {
                    background: #4caf50;
                    height: 100%;
                    transition: width 1s ease;
                }
                .actions {
                    margin-top: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .input-group {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                }
                .action-btn {
                    background: #007bff;
                    border: none;
                    color: white;
                    padding: 10px 20px;
                    cursor: pointer;
                    border-radius: 5px;
                    transition: background 0.3s ease;
                }
                .action-btn:hover {
                    background: #0056b3;
                }
                .connect-btn {
                    background: #ff9800;
                    border: none;
                    color: white;
                    padding: 10px 20px;
                    cursor: pointer;
                    border-radius: 5px;
                    transition: background 0.3s ease;
                }
                .connect-btn:hover {
                    background: #e68900;
                }
            `}</style>
        </main>
    );
}
