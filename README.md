## Smart Contract Management
My ATM
## Overview

"My ATM" is a web application that serves as a user-friendly frontend for interacting with a smart contract-based ATM system. This project utilizes React and Next.js to provide seamless interactions with the deployed smart contract, allowing users to deposit and withdraw Ethereum easily.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Contract Interaction](#contract-interaction)
- [License](#license)

## Features

- Connect your MetaMask wallet to interact with the ATM.
- Deposit and withdraw Ethereum through a simple interface.
- View your current balance in the application.

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **Next.js**: A React framework for server-rendered applications.
- **Ethers.js**: A library for interacting with the Ethereum blockchain.
- **MetaMask**: A browser extension for managing Ethereum wallets.

## Installation

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd my-atm-project
   ```

2. **Install Dependencies**

   Make sure you have Node.js and npm installed. Run the following command:

   ```bash
   npm install
   ```

## Usage

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Open your browser and go to `http://localhost:3000`.

3. Connect your MetaMask wallet to interact with the ATM.

## Contract Interaction

This frontend interacts with a smart contract deployed on the Ethereum blockchain. The contract allows users to deposit and withdraw funds, ensuring that only the owner of the account can perform these actions.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
