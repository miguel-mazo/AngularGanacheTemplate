import { Component, OnInit } from '@angular/core';
import { Web3Service } from 'src/app/services/web3.service';
import { BYTECODE } from 'src/assets/constantes/contrato-vehiculo.constants';

@Component({
  selector: 'app-vender',
  templateUrl: './vender.component.html',
  styleUrls: ['./vender.component.css']
})
export class VenderComponent implements OnInit {

  constructor(private web3Service: Web3Service) { }

  ngOnInit(): void {
  }

  async publicarVehiculo(){
    
    const contrato = this.web3Service.obtenerContratoConABI();
    try {

      const deployedContract = await contrato.deploy({
        data: BYTECODE,
        // arguments: [/* Parámetros del constructor, si los hay */],
      })
        .send({
          from: await this.web3Service.getAccount(),
          gas: 1500000, // Limite de gas
          gasPrice: '30000000000', // Precio del gas
        });

      // console.log("Cuenta: ", await this.web3Service.getAccount())

      deployedContract.methods.setOwnerInfo('pepe', 123456789)
      .send({ from: await this.web3Service.getAccount() })
      .on('confirmation', async (confirmationNumber: any, receipt: any) => {
        console.log("Cantidad de propietarios: ", await deployedContract.methods.getOwnershipHistoryCount().call())
      })

      deployedContract.methods
        .setVehicleInfo('Mazda', '3')
        .send({ from: await this.web3Service.getAccount() })
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

}
