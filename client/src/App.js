import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import { Button, Container, Form, Row, Col } from 'react-bootstrap';
import logo from "./ethereumLogo.png";
import "./App.css";

class App extends Component {

  state = { storageValue: 0, web3: null, accounts: null, contract: null, balance: 0 };

  componentDidMount = async () => {

    try {

      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];

      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      const balance = await instance.methods.getBalance().call();

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance, balance: balance }, this.runExample);

      // console.log(`instance ${this.state.contract}`);

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {

    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();


    this.setState({ storageValue: response });
  };

  onValueChange = async (e) => {

    const { accounts, contract } = this.state;

    await contract.methods.set(e.target.value).send({ from: accounts[0] });
    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    this.setState({ storageValue: response });

  }

  render() {

    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (
      <div className="App">
        <div className="App-header">
          <Row lg={12}>
            <Col>
              <img src={logo} alt="react-logo" style={{ width: '90px' }} />
              <p> ETH Smart Contract Swap Example </p>
              {/* <p> The stored value is : {this.state.storageValue} </p> */}
            </Col>
          </Row>
          <Container>
            <Row>
              <Col></Col>
              <Col>
                <Form >
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Address</Form.Label>
                    <Form.Control type="text" placeholder="0xeF83..." value={this.state.accounts[0]} onChange={(e) => this.onValueChange(e)} />
                  </Form.Group>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>ETH</Form.Label>
                    <Form.Control type="text" onChange={(e) => this.onValueChange(e)} />
                  </Form.Group>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>The stored value is : {this.state.storageValue} </Form.Label>
                  </Form.Group>
                </Form>
                <Button variant="primary" type="submit">
                  Swap
                </Button>
              </Col>
              <Col></Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}

export default App;