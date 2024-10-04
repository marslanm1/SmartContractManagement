const hre = require("hardhat");

async function main() {
    const initBalance = hre.ethers.utils.parseEther("1.0"); // Initial balance for the ATM
    const ATM = await hre.ethers.getContractFactory("MyATM"); // Get the contract factory for MyATM
    const atm = await ATM.deploy(initBalance); // Deploy the contract with initial balance
    await atm.deployed(); // Wait for deployment to finish

    console.log(`A contract with a balance of ${initBalance} ETH deployed to ${atm.address}`); // Log the deployed contract address

    // Add a secondary owner (replace this address with a valid Ethereum address)
    const secondaryOwner = "0xYourSecondaryOwnerAddressHere";
    await atm.addOwner(secondaryOwner);
    console.log(`Secondary owner ${secondaryOwner} added`);
}

// Execute the main function and handle errors
main().catch((error) => {
    console.error(error);
    process.exitCode = 1; // Exit with error code
});
