import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import SimpleGame from "./contracts/SimpleGame.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {

  state = {
    game: null,
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: ''
  };

  async componentDidMount() {

    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    console.log(`networkId ${networkId}`)

    const deployedNetwork = SimpleGame.networks[networkId];
    console.log(`deployedNetwork ${deployedNetwork.address}`)

    const lottery = new web3.eth.Contract(
      SimpleGame.abi,
      deployedNetwork.address
    );

    // console.log(`lottery ${lottery}`);
    // console.log(`lottery methods ${lottery.methods}`);
    // console.log(`lottery methods manager ${lottery.methods.manager()}`);
    // console.log(`lottery methods manager call ${lottery.methods.manager().call()}`);

    this.setState({ web3, accounts, game: lottery });

    // const manager = await lottery.methods.manager();
    // const players = await lottery.methods.getPlayers().call();
    // const balance = await web3.eth.getBalance(lottery.options.address);

    // this.setState({ manager, players, balance });

    console.log(`manager ${this.state.game}`)

  }

  // componentDidMount = async () => {
  //   try {
  //     // Get network provider and web3 instance.
  //     const web3 = await getWeb3();

  //     console.log(`web3 `, web3)

  //     // Use web3 to get the user's accounts.
  //     const accounts = await web3.eth.getAccounts();
  //     console.log(`accounts `, accounts)

  //     // Get the contract instance.
  //     const networkId = await web3.eth.net.getId();
  //     const deployedNetwork = SimpleStorageContract.networks[networkId];
  //     const instance = new web3.eth.Contract(
  //       SimpleStorageContract.abi,
  //       deployedNetwork && deployedNetwork.address,
  //     );



  //     // Set web3, accounts, and contract to the state, and then proceed with an
  //     // example of interacting with the contract's methods.
  //     this.setState({ web3, accounts, contract: instance }, this.runExample);

  //   } catch (error) {
  //     // Catch any errors for any of the above operations.
  //     alert(
  //       `Failed to load web3, accounts, or contract. Check console for details.`,
  //     );
  //     console.error(error);
  //   }
  // };

  runExample = async () => {

    console.log(`state `, this.state)

    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.

    // debugger
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 40</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
      </div>
    );
  }
}

export default App;
