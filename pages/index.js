import Head from "next/head";
import { useEffect, useState } from "react";
import { ContractABI } from "../constants/ContractABI";

import { ethers, utils } from "ethers";
import { truncateEthAddress } from "../utils/TruncAddress";

export default function Home() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const [isBankerOwner, setIsBankerOwner] = useState(false);

  const [inputValue, setInputValue] = useState({
    withdraw: "",
    deposit: "",
    bankName: "",
  });

  const [bankOwnerAddress, setBankOwnerAddress] = useState(null);

  const [customerTotalBalance, setCustomerTotalBalance] = useState(null);

  const [currentBankName, setCurrentBankName] = useState(null);

  const [customerAddress, setCustomerAddress] = useState(null);

  const [error, setError] = useState(null);

  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];
        setIsWalletConnected(true);
        setCustomerAddress(account);
        console.log("Account Connected: ", account);
      } else {
        setError("Please install a MetaMask wallet to use our bank.");
        console.log("No Metamask detected");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getBankName = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const bankContract = new ethers.Contract(
          process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
          ContractABI,
          signer
        );

        let bankName = await bankContract.bankName();
        bankName = utils.parseBytes32String(bankName);
        setCurrentBankName(bankName.toString());
      } else {
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setBankNameHandler = async (event) => {
    event.preventDefault();
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const bankContract = new ethers.Contract(
          process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
          ContractABI,
          signer
        );

        const txn = await bankContract.setBankName(
          utils.formatBytes32String(inputValue.bankName)
        );
        console.log("Setting Bank Name...");
        await txn.wait();
        console.log("Bank Name Changed", txn.hash);
        getBankName();
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getbankOwnerHandler = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const bankContract = new ethers.Contract(
          process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
          ContractABI,
          signer
        );

        let owner = await bankContract.bankOwner();
        setBankOwnerAddress(owner);

        const [account] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        if (owner.toLowerCase() === account.toLowerCase()) {
          setIsBankerOwner(true);
        }
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const customerBalanceHandler = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const bankContract = new ethers.Contract(
          process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
          ContractABI,
          signer
        );

        let balance = await bankContract.getMyBalance();
        setCustomerTotalBalance(utils.formatEther(balance));
        console.log("Retrieved balance...", balance);
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (event) => {
    setInputValue((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
  };

  const deposityMoneyHandler = async (event) => {
    try {
      event.preventDefault();
      if (window.ethereum) {
        //write data
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const bankContract = new ethers.Contract(
          process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
          ContractABI,
          signer
        );

        const txn = await bankContract.depositMoney({
          value: ethers.utils.parseEther(inputValue.deposit),
        });
        console.log("Deposting money...");
        await txn.wait();
        console.log("Deposited money...done", txn.hash);

        customerBalanceHandler();
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const withDrawMoneyHandler = async (event) => {
    try {
      event.preventDefault();
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const bankContract = new ethers.Contract(
          process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
          ContractABI,
          signer
        );

        let myAddress = await signer.getAddress();
        console.log("provider signer...", myAddress);

        const txn = await bankContract.withdrawMoney(
          myAddress,
          ethers.utils.parseEther(inputValue.withdraw)
        );
        console.log("Withdrawing money...");
        await txn.wait();
        console.log("Money with drew...done", txn.hash);

        customerBalanceHandler();
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    getBankName();
    getbankOwnerHandler();
    customerBalanceHandler();
  }, [isWalletConnected]);

  return (
    <div>
      <Head>
        <title>NextEdge</title>
        <link rel="icon" href="/logo.png" />
      </Head>
      {isWalletConnected ? (
        <main className="main-container font-body">
          <h2 className="headline">
            <span className="headline-gradient">NextEdge Bank</span> 💰
          </h2>
          <section className="customer-section px-10 pt-5 pb-10">
            {error && <p className="text-2xl text-red-700">{error}</p>}
            <div className="mt-5">
              {currentBankName === "" && isBankerOwner ? (
                <p>Setup the name of your bank.</p>
              ) : (
                <p className="text-3xl font-bold">{currentBankName}</p>
              )}
            </div>
            <div className="mt-7 mb-9">
              <form className="form-style">
                <input
                  type="text"
                  className="input-style"
                  onChange={handleInputChange}
                  name="deposit"
                  placeholder="0.0000 ETH"
                  value={inputValue.deposit}
                />
                <button className="btn-purple" onClick={deposityMoneyHandler}>
                  Deposit Money In ETH
                </button>
              </form>
            </div>
            <div className="mt-10 mb-10">
              <form className="form-style">
                <input
                  type="text"
                  className="input-style"
                  onChange={handleInputChange}
                  name="withdraw"
                  placeholder="0.0000 ETH"
                  value={inputValue.withdraw}
                />
                <button className="btn-purple" onClick={withDrawMoneyHandler}>
                  Withdraw Money In ETH
                </button>
              </form>
            </div>
            <div className="mt-5">
              <p>
                <span className="font-bold">Customer Balance: </span>
                {customerTotalBalance}
              </p>
            </div>
            <div className="mt-5">
              <p>
                <span className="font-bold">Bank Owner Address: </span>
                {truncateEthAddress(bankOwnerAddress)}
              </p>
            </div>
            <div className="mt-5">
              {isWalletConnected && (
                <p>
                  <span className="font-bold">Your Wallet Address: </span>
                  {truncateEthAddress(customerAddress)}
                </p>
              )}
              <button
                className="btn-connect"
                onClick={checkIfWalletIsConnected}
              >
                {isWalletConnected
                  ? "Wallet Connected 🔒"
                  : "Connect Wallet 🔑"}
              </button>
            </div>
          </section>
          {isBankerOwner && (
            <section className="bank-owner-section">
              <h2 className="text-xl border-b-2 border-blue-500 px-10 py-4 font-bold">
                Bank Admin Panel
              </h2>
              <div className="p-10">
                <form className="form-style">
                  <input
                    type="text"
                    className="input-style"
                    onChange={handleInputChange}
                    name="bankName"
                    placeholder="Enter a Name for Your Bank"
                    value={inputValue.bankName}
                  />
                  <button className="btn-grey" onClick={setBankNameHandler}>
                    Set Bank Name
                  </button>
                </form>
              </div>
            </section>
          )}
        </main>
      ) : (
        <div className="h-screen w-full font-body">
          <Head>
            <title>NextEdge</title>
            <link rel="icon" href="/logo.png" />
          </Head>
          <section className="max-w-[1440px] mx-0 my-0 flex items-center justify-center h-full flex-col">
            <div className="flex items-center justify-center flex-col">
              <div className="flex gap-2 my-3">
                <h1 className="text-5xl font-semibold my-3 headline-gradient leading-normal">
                  NextEdge Bank{" "}
                </h1>
              </div>
              <p className="text-center text-white">
                Without the involvement of middlemen, it enables users to
                purchase and sell assets and financial services as a means of
                financing or investment. <br />
              </p>
              <span className="text-sky-600 my-2 text-center">
                {" "}
                Built with Next JS, Hardhat, Solidity and Polygon Network{" "}
              </span>
            </div>
            <button className="btn-connect transition duration-150 ease-in-out hover:-translate-y-2">
              Connect Wallet
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
