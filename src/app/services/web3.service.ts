import { Injectable } from '@angular/core';
import Web3 from 'web3';
import configuration from '../../../build/contracts/Tickets.json';
import { AbiItem } from 'web3-utils'
import { BehaviorSubject } from 'rxjs';
import { ABI, BYTECODE } from 'src/assets/constantes/contrato-vehiculo.constants';

declare let window: any;

@Injectable({
  providedIn: 'root',
})
export class Web3Service {
  private web3: Web3;
  addressUser: any = new BehaviorSubject<string>('');
  CONTRACT_ADDRESS = configuration.networks['1337'].address;

  constructor() {
    this.web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:8545');
  }

  async desplegarContracto(){

    const contrato = this.obtenerContratoConABI();
    try {

      const deployedContract = await contrato.deploy({
        data: BYTECODE,
        // arguments: [/* Parámetros del constructor, si los hay */],
      })
        .send({
          from: await this.getAccount(),
          gas: 1500000, // Limite de gas
          gasPrice: '30000000000', // Precio del gas
        });

      // console.log("Cuenta: ", await this.web3Service.getAccount())

      deployedContract.methods.setOwnerInfo('pepe', 123456789)
      .send({ from: await this.getAccount() })
      .on('confirmation', async (confirmationNumber: any, receipt: any) => {
        console.log("Cantidad de propietarios: ", await deployedContract.methods.getOwnershipHistoryCount().call())
      })

      deployedContract.methods
        .setVehicleInfo('Mazda', '3')
        .send({ from: await this.getAccount() })
        .on('confirmation', async (confirmationNumber: any, receipt: any) => {
          
        console.log("Marca vehículo: ", await deployedContract.methods.getVehicleInfo().call())
        })
      // .on('transactionHash', (hash: any) => {
      //   console.log('Transaction Hash:', hash);
      // })
      // .on('confirmation', (confirmationNumber: any, receipt: any) => {
      //   console.log('Confirmation Number:', confirmationNumber);
      //   console.log('Receipt:', receipt);
      // })
      // .on('error', (error: any) => {
      //   console.error('Error:', error);
      // });
      
      console.log("Dirección contrato: ", deployedContract.options.address)
      console.log("Contrato: ", deployedContract)
      
      
      return deployedContract.options.address;

    } catch (error) {
      console.error('Error al desplegar el contrato:', error);
      throw error;
    }
  }

  obtenerContratoConABI() {
    return new this.web3.eth.Contract(ABI as AbiItem[]);
  }

  getContract() {
    const CONTRACT_ABI = configuration.abi;

    return new this.web3.eth.Contract(CONTRACT_ABI as AbiItem[], this.CONTRACT_ADDRESS);
  }

  // async requestAccounts() {
  //   return await this.web3.eth.requestAccounts();
  // }

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
}