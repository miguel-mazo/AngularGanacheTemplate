import { Component, OnInit } from '@angular/core';
import { Web3Service } from 'src/app/services/web3.service';
import { BYTECODE } from 'src/assets/constantes/contrato-vehiculo.constants';

@Component({
  selector: 'app-vender',
  templateUrl: './vender.component.html',
  styleUrls: ['./vender.component.css']
})
export class VenderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {    
  }
}
