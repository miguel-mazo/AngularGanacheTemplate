import { Injectable } from '@angular/core';
import Web3 from 'web3';
import configuration from '../../../build/contracts/Tickets.json';
import { AbiItem } from 'web3-utils'
import { BehaviorSubject } from 'rxjs';

declare let window: any;

@Injectable({
  providedIn: 'root',
})
export class Web3Service {
  private web3: Web3;
  addressUser: any = new BehaviorSubject<string>('');

  constructor() {
    this.web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:8545');
  }

  getContract() {
    const CONTRACT_ADDRESS = configuration.networks['1337'].address;
    const CONTRACT_ABI = configuration.abi;

    return new this.web3.eth.Contract(CONTRACT_ABI as AbiItem[], CONTRACT_ADDRESS);
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
    });
  }
}