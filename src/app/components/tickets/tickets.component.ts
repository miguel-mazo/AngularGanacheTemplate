import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Web3Service } from 'src/app/services/web3.service';

class Ticket {
  id!:number;
  price!: number;   // Considera el tipo de dato correcto para el precio (puede ser 'number' o 'string' dependiendo de tus necesidades)
  owner!: string;   // La dirección Ethereum se suele representar como una cadena de texto en TypeScript
}

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css'],
})
export class TicketsComponent implements OnInit {
  tickets: any[] = []; // Replace 'any' with the actual type of your tickets
  ticket: Ticket = new Ticket();

  constructor(private web3Service: Web3Service) {}

  ngOnInit() {
    this.refreshTickets();
  }

  async refreshTickets() {
    const contract = this.web3Service.getContract();
    // Implement logic to retrieve and update 'tickets' array

    const totalTickets = await contract.methods.TOTAL_TICKETS().call();
    this.tickets = [];
    for (let i = 0; i < totalTickets; i++) {
      this.ticket = await contract.methods.tickets(i).call();
      this.ticket.id = i;
      if(this.ticket.owner === '0x0000000000000000000000000000000000000000'){
        this.tickets.push(this.ticket)
      }
    }
  }

  handleTicketBought() {   
    this.refreshTickets();
  }
}