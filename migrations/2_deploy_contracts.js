// const HelloWorld = artifacts.require(`./HelloWorld.sol`);
const SimpleStorage = artifacts.require("./SimpleStorage.sol");

module.exports = function (deployer) {
  // deployer.deploy(HelloWorld);
  deployer.deploy(SimpleStorage);
};