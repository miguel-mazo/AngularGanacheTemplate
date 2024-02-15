// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VehiculoContract {
    address public propietario;

    struct DatosBasicosVehiculo {
        string placa;
        string numeroMotor;
        string numeroChasis;
        string VIN;
        string marca;
        string clase;
        string linea;
        string modelo;
        string color;
        uint256 fechaMatricula;
        address direccionCuentaOT;
    }

    struct DetallesVehiculo {
        string cilindraje;
        string potencia;
        string capacidad;
        string servicio;
        string carroceria;
        string combustible;
    }

    struct OwnerInfo {
        string name;
        uint256 cedula;
    }

    struct OwnershipRecord {
        address previousOwner;
        uint256 timestamp;
    }

    DatosBasicosVehiculo public datosBasicosVehiculo;
    DetallesVehiculo public detallesVehiculo;
    OwnerInfo public ownerData;
    OwnershipRecord[] public ownershipHistory;

    modifier onlyOwner() {
        require(msg.sender == propietario, "Only the owner can call this function");
        _;
    }

    constructor() {
        propietario = msg.sender;
    }

    function llenarDatosBasicosVehiculo(
        string memory _placa,
        string memory _numeroMotor,
        string memory _numeroChasis,
        string memory _VIN,
        string memory _marca,
        string memory _clase,
        string memory _linea,
        string memory _modelo,
        string memory _color
    ) public onlyOwner {
        datosBasicosVehiculo = DatosBasicosVehiculo({
            placa: _placa,
            numeroMotor: _numeroMotor,
            numeroChasis: _numeroChasis,
            VIN: _VIN,
            marca: _marca,
            clase: _clase,
            linea: _linea,
            modelo: _modelo,
            color: _color,
            fechaMatricula: block.timestamp,
            direccionCuentaOT: msg.sender
        });
    }

    function llenarDetallesVehiculo(
        string memory _cilindraje,
        string memory _potencia,
        string memory _capacidad,
        string memory _servicio,
        string memory _carroceria,
        string memory _combustible
    ) public onlyOwner {
        detallesVehiculo = DetallesVehiculo({
            cilindraje: _cilindraje,
            potencia: _potencia,
            capacidad: _capacidad,
            servicio: _servicio,
            carroceria: _carroceria,
            combustible: _combustible
        });
    }

    function setOwnerInfo(string memory _name, uint256 _cedula) public onlyOwner {
        // Añade un nuevo registro al historial de propietarios
        ownershipHistory.push(OwnershipRecord({
            previousOwner: propietario,
            timestamp: block.timestamp
        }));

        ownerData = OwnerInfo({
            name: _name,
            cedula: _cedula
        });

        // Actualiza al nuevo propietario
        propietario = msg.sender;
    }

    function getOwnershipHistoryCount() public view returns (uint256) {
        return ownershipHistory.length;
    }

    function obtenerDatosBasicosVehiculo() public view returns (
        string memory, string memory, string memory, string memory, string memory,
        string memory, string memory, string memory, string memory, uint256, address
    ) {
        return (
            datosBasicosVehiculo.placa,
            datosBasicosVehiculo.numeroMotor,
            datosBasicosVehiculo.numeroChasis,
            datosBasicosVehiculo.VIN,
            datosBasicosVehiculo.marca,
            datosBasicosVehiculo.clase,
            datosBasicosVehiculo.linea,
            datosBasicosVehiculo.modelo,
            datosBasicosVehiculo.color,
            datosBasicosVehiculo.fechaMatricula,
            datosBasicosVehiculo.direccionCuentaOT
        );
    }

    function obtenerDetallesVehiculo() public view returns (
        string memory, string memory, string memory, string memory, string memory, string memory
    ) {
        return (
            detallesVehiculo.cilindraje,
            detallesVehiculo.potencia,
            detallesVehiculo.capacidad,
            detallesVehiculo.servicio,
            detallesVehiculo.carroceria,
            detallesVehiculo.combustible
        );
    }
}