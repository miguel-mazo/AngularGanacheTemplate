import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Web3Service } from 'src/app/services/web3.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css'],
})
export class TicketComponent {
  @Input() ticket: any; // Replace 'any' with the actual type of your ticket
  @Output() ticketBought: EventEmitter<any> = new EventEmitter<any>();
  account: any;
  constructor(private web3Service: Web3Service) {}

  async buyTicket() {
    // Call the buyTicket method from the parent component or handle the purchase logic here
    // You can use this.ticket to access the ticket details
    const contract = this.web3Service.getContract();
    
    const accounts = await this.web3Service.requestAccounts();    
    // Do something with the accounts if needed
    this.account = accounts[0];

    await contract.methods.buyTicket(this.ticket.id).send({ 
      from: this.account,
      value: this.ticket.price
    });

    this.ticketBought.emit();
  }
}