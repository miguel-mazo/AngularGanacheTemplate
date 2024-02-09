const VehicleContract = artifacts.require("VehicleContract");

module.exports = function (deployer) {
    deployer.deploy(VehicleContract);
};