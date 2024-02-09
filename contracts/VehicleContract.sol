// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VehicleContract {
    address public owner;
    
    struct VehicleInfo {
        string brand;
        string model;
    }

    struct OwnerInfo {
        string name;
        uint256 cedula;
    }

    struct OwnershipRecord {
        address previousOwner;
        uint256 timestamp;
    }

    VehicleInfo public vehicleData;
    OwnerInfo public ownerData;
    OwnershipRecord[] public ownershipHistory;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function setVehicleInfo(string memory _brand, string memory _model) public onlyOwner {
        vehicleData = VehicleInfo({
            brand: _brand,
            model: _model
        });
    }

    function setOwnerInfo(string memory _name, uint256 _cedula) public onlyOwner {
        // Añade un nuevo registro al historial de propietarios
        ownershipHistory.push(OwnershipRecord({
            previousOwner: owner,
            timestamp: block.timestamp
        }));

        ownerData = OwnerInfo({
            name: _name,
            cedula: _cedula
        });

        // Actualiza al nuevo propietario
        owner = msg.sender;
    }

    function getOwnershipHistoryCount() public view returns (uint256) {
        return ownershipHistory.length;
    }

    function getVehicleInfo() public view returns (string memory) {
        return (vehicleData.brand);
    }
}