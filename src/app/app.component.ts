import { Component } from '@angular/core';
// import Web3 from 'web3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'test-angular-ganache';
  // private web3: Web3;

  constructor() {
    // this.web3 = new Web3("http://127.0.0.1:8545");
    // const accountsTemp = this.web3.eth.getAccounts();
    // console.log("Accounts temp: ", accountsTemp);
    // console.log("Create account " + (this.web3.eth.accounts.create()).address);
    // console.log("SignContracts: ")
    // this.web3.eth.accounts.signTransaction({
    //   to: '0x859CaBaa25A882D11888474BA68C2668E27b321e',
    //   value: '50',
    //   gas: 2000000
    // }, '0x8968fc4b0806c23ca5f6ce3eeb763da5c84076b59f9875404769629b32842fcf')
    // .then(console.log);
    // console.log("Hash message " + this.web3.eth.accounts.hashMessage("Hello World"));
    // console.log("obj wallets for account: ", this.web3.eth.accounts.wallet);
  }
}
