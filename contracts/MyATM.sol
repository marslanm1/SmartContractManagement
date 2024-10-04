// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract MyATM {
    address payable public owner;
    uint256 public balance;
    mapping(address => bool) public owners;
    mapping(address => uint256) public userBalances;
    mapping(address => uint256) public depositTimestamps;

    uint256 public depositFeePercentage = 1; // 1%
    bool public paused;

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event OwnerAdded(address indexed newOwner);
    event OwnerRemoved(address indexed oldOwner);
    event ContractPaused();
    event ContractUnpaused();

    modifier onlyOwner() {
        require(owners[msg.sender], "You are not the owner of this account");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        owners[msg.sender] = true;
        balance = initBalance;
    }

    function addOwner(address newOwner) public onlyOwner {
        owners[newOwner] = true;
        emit OwnerAdded(newOwner);
    }

    function removeOwner(address ownerToRemove) public onlyOwner {
        owners[ownerToRemove] = false;
        emit OwnerRemoved(ownerToRemove);
    }

    function deposit() public payable whenNotPaused {
        require(msg.value > 0, "Must deposit an amount greater than 0");
        uint256 fee = (msg.value * depositFeePercentage) / 100;
        uint256 netAmount = msg.value - fee;

        userBalances[msg.sender] += netAmount;
        balance += netAmount;
        depositTimestamps[msg.sender] = block.timestamp;

        emit Deposit(msg.sender, netAmount);
    }

    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public whenNotPaused {
        if (userBalances[msg.sender] < _withdrawAmount) {
            revert InsufficientBalance({ balance: userBalances[msg.sender], withdrawAmount: _withdrawAmount });
        }
        userBalances[msg.sender] -= _withdrawAmount;
        balance -= _withdrawAmount;
        payable(msg.sender).transfer(_withdrawAmount);
        emit Withdraw(msg.sender, _withdrawAmount);
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    function getUserBalance(address user) public view returns (uint256) {
        return userBalances[user];
    }

    function pause() public onlyOwner {
        paused = true;
        emit ContractPaused();
    }

    function unpause() public onlyOwner {
        paused = false;
        emit ContractUnpaused();
    }

    function emergencyWithdraw(uint256 _amount) public onlyOwner {
        require(balance >= _amount, "Insufficient balance");
        balance -= _amount;
        payable(owner).transfer(_amount);
    }

    function applyInterest(address user) internal {
        uint256 timeElapsed = block.timestamp - depositTimestamps[user];
        // Assume interest is compounded daily
        uint256 interest = (userBalances[user] * 5 * timeElapsed) / (365 days * 100);
        userBalances[user] += interest;
    }
}
