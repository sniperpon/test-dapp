/*global ethereum, MetamaskOnboarding */

/*
The `piggybankContract` is compiled from:

  pragma solidity ^0.4.0;
  contract PiggyBank {

      uint private balance;
      address public owner;

      function PiggyBank() public {
          owner = msg.sender;
          balance = 0;
      }

      function deposit() public payable returns (uint) {
          balance += msg.value;
          return balance;
      }

      function withdraw(uint withdrawAmount) public returns (uint remainingBal) {
          require(msg.sender == owner);
          balance -= withdrawAmount;

          msg.sender.transfer(withdrawAmount);

          return balance;
      }
  }
*/

const forwarderOrigin = 'http://localhost:9010'

const initialize = () => {
  const onboarding = new MetaMaskOnboarding({ forwarderOrigin });
  const onboardButton = document.getElementById('connectButton');
  const getAccountsButton = document.getElementById('getAccounts');
  const getAccountsResult = document.getElementById('getAccountsResult');


  // This function will see if MetaMask is installed
  const isMetaMaskInstalled = () => {
    const { ethereum } = window;

    // We can tell by checking a property on the ethereum object
    return Boolean(ethereum && ethereum.isMetaMask);
  };


  // This function will start the onboarding process
  const onClickInstall = () => {
    onboardButton.innerText = 'Onboarding in progress...';
    onboardButton.disabled = true;
    onboarding.startOnboarding();
  };


  // This function will handle them clicking the connect button
  const onClickConnect = async () => {
    try {
      await ethereum.request({ method: 'eth_requestAccounts' });
    }
    catch (error) {
      console.error(error);
    }
  };


  // This function will control the connect button behavior
  const MetaMaskClientCheck = () => {
    if (!isMetaMaskInstalled()) {
      
      // It's not installed, so ask the user to install it
      onboardButton.innerText = 'Click here to install MetaMask!';
      onboardButton.onclick = onClickInstall;
    }
    else {
      // It is installed, so let them connect
      onboardButton.innerText = 'Connect';
      onboardButton.onclick = onClickConnect;
      onboardButton.disabled = false;
    }
  };
  MetaMaskClientCheck();

  // This method handles the account button click event
  getAccountsButton.addEventListener('click', async () => {
    const accounts = await ethereum.request({ method: 'eth_accounts' });

    // Show the first account if possible
    getAccountsResult.innerHTML = accounts[0] || 'Not able to get accounts';
  });
}
window.addEventListener('DOMContentLoaded', initialize)
