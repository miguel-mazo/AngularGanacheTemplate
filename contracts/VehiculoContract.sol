// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VehiculoContract {
    address public propietario;
    address[] public historialPropietarios;
    uint256 public precioVenta;
    bool public enVenta;

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

    DatosBasicosVehiculo public datosBasicosVehiculo;
    DetallesVehiculo public detallesVehiculo;

    modifier onlyOwner() {
        require(msg.sender == propietario);
        _;
    }

    constructor() {
        propietario = msg.sender;
        historialPropietarios.push(msg.sender);
    }

    function cambiarPropietario(address nuevoPropietario) internal {
        propietario = nuevoPropietario;
        historialPropietarios.push(nuevoPropietario);
    }

    function ponerEnVenta(uint256 _precioVenta) public onlyOwner {
        precioVenta = _precioVenta;
        enVenta = true;
    }

    function comprarVehiculo() public payable {
        require(enVenta);
        require(msg.value >= precioVenta);

        address propietarioActual = propietario;

        cambiarPropietario(msg.sender);

        payable(propietarioActual).transfer(precioVenta);

        enVenta = false;
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
            detallesVehiculo.combustible,
            detallesVehiculo.cilindraje,
            detallesVehiculo.potencia,
            detallesVehiculo.capacidad,
            detallesVehiculo.servicio,
            detallesVehiculo.carroceria
        );
    }

    function obtenerTamanoHistorial() public view returns (uint256) {
        return historialPropietarios.length;
    }
}