import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Web3Service } from './services/web3.service';
import { CuentasAdministradoras } from 'src/assets/constantes/cuentas-administradoras.constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'test-angular-ganache';
  cuenta!: string;
  esAdministrador!: boolean;

  constructor(private cdr: ChangeDetectorRef, private web3Service: Web3Service) {
    this.web3Service.manejadorCambioCuentas();
  }

  ngOnInit() {
    this.inicializarWeb3();

    this.web3Service.direccionUsuario.subscribe((res: string) => {
      this.cuenta = res;
      this.esAdministrador = CuentasAdministradoras.includes(this.cuenta.toLocaleLowerCase())? true : false;
      this.cdr.detectChanges();
    });
  }

  private async inicializarWeb3() {
    this.cuenta = await this.web3Service.obtenerCuenta();
  }
}
