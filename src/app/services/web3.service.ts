import { Injectable } from '@angular/core';
import Web3 from 'web3';
import vehiculoContract from '../../../build/contracts/VehiculoContract.json';
import { AbiItem } from 'web3-utils'
import { BehaviorSubject } from 'rxjs';
import { Vehiculo } from '../models/vehiculo.model';
import { NgxUiLoaderService } from 'ngx-ui-loader';

declare let window: any;

@Injectable({
  providedIn: 'root',
})
export class Web3Service {
  private web3: Web3;
  addressUser: any = new BehaviorSubject<string>('');
  VEHICULO_CONTRACT_ADRESS = vehiculoContract.networks['1337'].address;

  constructor(private ngxLoader: NgxUiLoaderService) {
    this.web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:8545');
  }

  async llenarDatosVehiculo(direccionContrato: string, vehiculo: Vehiculo, precio: number){
    
    const contrato = this.obtenerContratoPorDireccionIngresada(direccionContrato);
      try {

        const datosBasicosPromesa = this.llenarDatosBasicosVehiculo(contrato, vehiculo);
        const detallesPromesa = this.llenarDetallesVehiculo(contrato, vehiculo);
        const precioVenta = this.asignarPrecioVenta(contrato, precio);
        
        // Esperar a que ambas promesas se resuelvan
        await Promise.all([datosBasicosPromesa, detallesPromesa, precioVenta]);

        return true;
        
      } catch (error) {
        // Manejar errores si es necesario
        return false;
      }
  }

  async asignarPrecioVenta(contrato: any, precioVenta: number){

    precioVenta = precioVenta * 1e18;

    return new Promise(async (resolve, reject) => {
      try {
        await contrato.methods.ponerEnVenta(
          precioVenta.toString()
        ).send({
          from: await this.getAccount()
        }).on('confirmation', async (confirmationNumber: any, receipt: any) => {
          console.log("Precio de venta: ", await contrato.methods.precioVenta().call());
          resolve("Precio de venta del vehículo registrado");  // Resuelve la promesa cuando el método se ha ejecutado correctamente
        });
      } catch (error) {
        reject(error);  // Rechaza la promesa en caso de error
      }
    });
  }
  
  async llenarDatosBasicosVehiculo(contrato: any, vehiculo: Vehiculo) {
    return new Promise(async (resolve, reject) => {
      try {
        await contrato.methods.llenarDatosBasicosVehiculo(
          vehiculo.placa,
          vehiculo.numeroMotor,
          vehiculo.numeroChasis,
          vehiculo.VIN,
          vehiculo.marca,
          vehiculo.clase,
          vehiculo.linea,
          vehiculo.modelo,
          vehiculo.color
        ).send({
          from: await this.getAccount()
        }).on('confirmation', async (confirmationNumber: any, receipt: any) => {
          console.log("Info vehículo datos básicos: ", await contrato.methods.obtenerDatosBasicosVehiculo().call());
          resolve("Datos básicos del vehículo registrados");  // Resuelve la promesa cuando el método se ha ejecutado correctamente
        });
      } catch (error) {
        reject(error);  // Rechaza la promesa en caso de error
      }
    });
  }

  async llenarDetallesVehiculo(contrato: any, vehiculo: Vehiculo) {
    return new Promise(async (resolve, reject) => {
      try {
        await contrato.methods.llenarDetallesVehiculo(
          vehiculo.cilindraje,
          vehiculo.potencia,
          vehiculo.capacidad,
          vehiculo.servicio,
          vehiculo.carroceria,
          vehiculo.combustible
        ).send({
          from: await this.getAccount()
        }).on('confirmation', async (confirmationNumber: any, receipt: any) => {
          console.log("Info vehículo detalles: ", await contrato.methods.obtenerDetallesVehiculo().call());
          resolve("Detalles del vehículo registrados");  // Resuelve la promesa cuando el método se ha ejecutado correctamente
        });
      } catch (error) {
        reject(error);  // Rechaza la promesa en caso de error
      }
    });
  }

  obtenerContratoPorDireccion() {
    const ABI_VEHICULO_CONTRACT = vehiculoContract.abi;

    return new this.web3.eth.Contract(ABI_VEHICULO_CONTRACT as AbiItem[], this.VEHICULO_CONTRACT_ADRESS);
  }

  obtenerContratoPorDireccionIngresada(direccionContrato: string) {
    const ABI_VEHICULO_CONTRACT = vehiculoContract.abi;

    return new this.web3.eth.Contract(ABI_VEHICULO_CONTRACT as AbiItem[], direccionContrato);
  }

  async getAccount(): Promise<string> {
    const accounts = await this.web3.eth.requestAccounts();    
    // Do something with the accounts if needed
    return accounts[0];
  }

  async handleAccountsChanged(){
    const accounts: string[] = await window.ethereum.request({ method: 'eth_requestAccounts' });

    this.addressUser.next(accounts[0]);

    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      this.addressUser.next(accounts[0]);
      location.reload();
    });
  }

  async obtenerDatosBasicosVehiculo(direccionContrato: string): Promise<any> {

    const contrato = this.obtenerContratoPorDireccionIngresada(direccionContrato);

    try {
      const datos = await contrato.methods.obtenerDatosBasicosVehiculo().call();
      return datos;
    } catch (error) {
      return '';
      // throw error;
    }
  }

  async obtenerDetallesVehiculo(direccionContrato: string): Promise<any> {

    const contrato = this.obtenerContratoPorDireccionIngresada(direccionContrato);

    try {
      const datos = await contrato.methods.obtenerDetallesVehiculo().call();
      return datos;
    } catch (error) {
      return '';
      // throw error;
    }
  }

  async obtenerPrecioVehiculo(direccionContrato: string): Promise<any> {

    const contrato = this.obtenerContratoPorDireccionIngresada(direccionContrato);

    try {
      const precio = await contrato.methods.precioVenta().call()
      return precio/1e18;
    } catch (error) {
      return '';
      // throw error;
    }
  }

  async comprarVehiculo(direccionContrato: string): Promise<any> {

    const contrato = await this.obtenerContratoPorDireccionIngresada(direccionContrato);
    const precioVenta = await this.obtenerPrecioVehiculo(direccionContrato);
    try {
      await contrato.methods.comprarVehiculo().send({
        from: await this.getAccount(),
        value: this.web3.utils.toWei(precioVenta.toString(), 'ether'),
      });
    } catch (error) {
      return '';
      // throw error;
    }
  }

  async ponerVehiculoEnVenta(direccionContrato: string, precioVenta: number){

    const contrato = this.obtenerContratoPorDireccionIngresada(direccionContrato);

    precioVenta = precioVenta * 1e18;
    console.log("PRECIO VENTA: ",precioVenta)
    return new Promise(async (resolve, reject) => {
      try {
        await contrato.methods.ponerEnVenta(
          precioVenta.toString()
        ).send({
          from: await this.getAccount()
        }).on('confirmation', async (confirmationNumber: any, receipt: any) => {
          console.log("Precio de venta: ", await contrato.methods.precioVenta().call());
          resolve("Precio de venta del vehículo asignado");  // Resuelve la promesa cuando el método se ha ejecutado correctamente
        });
      } catch (error) {
        reject(error);  // Rechaza la promesa en caso de error
      }
    });
  }

  async obtenerPropietarioVehiculo(direccionContrato: string): Promise<any> {

    const contrato = this.obtenerContratoPorDireccionIngresada(direccionContrato);

    try {
      const propietario = await contrato.methods.propietario().call();
      return propietario;
    } catch (error) {
      return '';
      // throw error;
    }
  }

  async obtenerEstadoVentaVehiculo(direccionContrato: string): Promise<any> {

    const contrato = this.obtenerContratoPorDireccionIngresada(direccionContrato);

    try {
      const enVenta = await contrato.methods.enVenta().call();
      return enVenta;
    } catch (error) {
      return '';
      // throw error;
    }
  }

  async obtenerHistorialPropietariosVehiculo(direccionContrato: string): Promise<any> {

    try{

      const contrato = this.obtenerContratoPorDireccionIngresada(direccionContrato);

      const tamanoHistorial = await contrato.methods.obtenerTamanoHistorial().call();
      const historialPropietarios = [];

      for (let i = 0; i < tamanoHistorial; i++) {
        const propietario = await contrato.methods.historialPropietarios(i).call();
        historialPropietarios.push(propietario);
      }
      // const historialPropietarios = await contrato.methods.historialPropietarios(0).call();
      return historialPropietarios;
    } catch (error) {
      return '';
      // throw error;
    }
  }

  async obtenerHistorialFechasEventosVehiculo(direccionContrato: string): Promise<any> {

    try{

      const contrato = this.obtenerContratoPorDireccionIngresada(direccionContrato);

      const tamanoHistorial = await contrato.methods.obtenerTamanoHistorial().call();
      const fechaEventos = [];

      for (let i = 0; i < tamanoHistorial; i++) {
        const propietario = await contrato.methods.fechaEventos(i).call();
        fechaEventos.push(propietario);
      }
      
      return fechaEventos;
    } catch (error) {
      return '';
      // throw error;
    }
  }
}