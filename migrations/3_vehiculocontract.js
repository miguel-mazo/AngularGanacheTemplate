const VehiculoContract = artifacts.require("VehiculoContract");

module.exports = function (deployer) {
    deployer.deploy(VehiculoContract);
};