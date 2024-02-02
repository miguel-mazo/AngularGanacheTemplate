import { Injectable } from '@angular/core';
import Web3 from 'web3';
import configuration from '../../../build/contracts/Tickets.json';
import { AbiItem } from 'web3-utils'

@Injectable({
  providedIn: 'root',
})
export class Web3Service {
  private web3: Web3;

  constructor() {
    this.web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:8545');
  }

  getContract() {
    const CONTRACT_ADDRESS = configuration.networks['1337'].address;
    const CONTRACT_ABI = configuration.abi;

    return new this.web3.eth.Contract(CONTRACT_ABI as AbiItem[], CONTRACT_ADDRESS);
  }

  async requestAccounts() {
    return await this.web3.eth.requestAccounts();
  }
}