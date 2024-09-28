// We require the Hardhat Runtime Environment explicitly here.
const hre = require("hardhat");

async function main() {
    const initBalance = 1; // Initial balance for the ATM
    const ATM = await hre.ethers.getContractFactory("MyATM"); // Get the contract factory for MyATM
    const atm = await ATM.deploy(initBalance); // Deploy the contract with initial balance
    await atm.deployed(); // Wait for deployment to finish

    console.log(`A contract with a balance of ${initBalance} ETH deployed to ${atm.address}`); // Log the deployed contract address
}

// Execute the main function and handle errors
main().catch((error) => {
    console.error(error);
    process.exitCode = 1; // Exit with error code
});
