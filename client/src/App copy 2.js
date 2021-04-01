import React from "react";
import { useForm } from "react-hook-form";
import { Component, useEffect, useState } from 'react';
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import logo from "./ethereumLogo.png";
import "./App.css";

export default function App() {

  const [storage, setStorageValue] = useState(0);
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);
  const { register, handleSubmit, watch, errors } = useForm();

  useEffect(async () => {

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

      setWeb3(web3);


      console.log(``)
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }, []);

  const onSubmit = data => console.log(data);

  console.log(watch("example")); // watch input value by passing the name of it

  //  runExample = async () => {

  //   const { accounts, contract } = this.state;

  //   // Stores a given value, 5 by default.
  //   await contract.methods.set(5).send({ from: accounts[0] });

  //   // Get the value from the contract to prove it worked.
  //   const response = await contract.methods.get().call();

  //   // Update state with the result.
  //   debugger
  //   this.setState({ storageValue: response });
  // };


  return (

    < form onSubmit={handleSubmit(onSubmit)} >

      < input name="example" defaultValue="test" ref={register} />

      < input name="exampleRequired" ref={register({ required: true })} />
      { errors.exampleRequired && <span>This field is required</span>}

      <input type="submit" />
    </form >
  );
}