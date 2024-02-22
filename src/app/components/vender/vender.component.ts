import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Web3Service } from 'src/app/services/web3.service';
import { CAMPO_OBLIGATORIO } from 'src/assets/constantes/errores.constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vender',
  templateUrl: './vender.component.html',
  styleUrls: ['./vender.component.css']
})
export class VenderComponent implements OnInit {

  formularioVender!: FormGroup;
  formularioPrecio!: FormGroup;
  ERROR_CAMPO_OBLIGATORIO = CAMPO_OBLIGATORIO;
  token: string = ''
  datosBasicosVehiculo: any = [];
  detallesVehiculo: any = [];
  precioVehiculo!: number;
  fechaMatricula: string = '';
  direccionPropietarioActual?: string;
  mostrarFormularioVenta: boolean = false;

  constructor(private web3Service: Web3Service, private formBuilder: FormBuilder, private ngxLoader: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.construirFormulario();    
  }

  construirFormulario() {
    this.formularioVender = this.formBuilder.group({
      token: ['', Validators.required]
    });

    this.formularioPrecio = this.formBuilder.group({
      precio: [, Validators.required]
    });
  }

  async enviarFormularioConsultaContrato() {
    if (this.formularioVender.valid) {
      this.mostrarFormularioVenta = false;
      this.datosBasicosVehiculo = [];
      this.detallesVehiculo = [];
      // Lógica para manejar la presentación del formulario
      console.log('Formulario válido. Datos:', this.formularioVender.value);
      // Agrega aquí la lógica para enviar o procesar los datos
      const token =  this.formularioVender.get('token');
      this.token = token?.value
      this.obtenerDatosVehiculo();
    }
  }

  async obtenerDatosVehiculo() {
    this.obtenerDatosBasicosVehiculo();
    this.obtenerDetallesVehiculo();

    this.direccionPropietarioActual = await this.obtenerDireccionPropietarioActual();
    await Promise.all([this.direccionPropietarioActual]);

    this.validarPropietario();    
  }

  async obtenerDatosBasicosVehiculo() {
    try {
      this.datosBasicosVehiculo = await this.web3Service.obtenerDatosBasicosVehiculo(this.token);
      this.fechaMatricula = this.convertirSegundosAFecha(this.datosBasicosVehiculo[9]);
      console.log("Desde el vender datosVehiculo es:", this.datosBasicosVehiculo)
    } catch (error) {
      this.datosBasicosVehiculo = [];
      Swal.fire({
        icon: 'error',
        title: '¡Vehículo no registrado!',
        text: 'El vehículo asociado al token ' + this.token + ' aún no ha sido registrado'
      });
      // console.error('Error al obtener datos del vehículo:', error);
    }
  }

  async obtenerDetallesVehiculo() {
    try {
      this.detallesVehiculo = await this.web3Service.obtenerDetallesVehiculo(this.token);
      console.log("Desde el vender datosVehiculo es:", this.detallesVehiculo)
    } catch (error) {
      this.detallesVehiculo = [];
      // console.error('Error al obtener detalles del vehículo:', error);
    }
  }

  convertirSegundosAFecha(segundosString: string): string {
    const segundos = parseInt(segundosString, 10);

    const fecha = new Date(segundos * 1000);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();

    return `${dia}/${mes}/${anio}`;
  }

  async enviarFormularioAsignarPrecio(){
    if (this.formularioPrecio.valid) {
      try{
        this.ngxLoader.start();
        console.log('Formulario válido. Datos:', this.formularioVender.value);
        // Agrega aquí la lógica para enviar o procesar los datos
        const token =  this.formularioVender.get('token');
        this.token = token?.value;
        this.precioVehiculo = this.formularioPrecio.get('precio')?.value;

        const respuesta = this.web3Service.ponerVehiculoEnVenta(this.token, this.precioVehiculo);
        await Promise.all([respuesta]);

        Swal.fire({
          icon: 'success',
          title: '¡Vehículo en venta!',
          text: 'El vehículo asociado al token ' + this.token + ' se ha puesto a la venta'
        });

        this.token = '';
        this.datosBasicosVehiculo = [];
        this.detallesVehiculo = [];
        this.mostrarFormularioVenta = false;
        
      } finally {
        this.ngxLoader.stop();
      }
    }
  }

  async obtenerDireccionPropietarioActual(){
    return this.web3Service.obtenerPropietarioVehiculo(this.token);
  }

  async validarPropietario(){
    const cuentaActual = await this.web3Service.getAccount();

    if(cuentaActual !== this.direccionPropietarioActual){
      Swal.fire({
        icon: 'error',
        title: '¡Error al vender el vehículo!',
        text: 'El vehículo asociado al token ' + this.token + ' no es de su propiedad'
      });
    } else{
      this.mostrarFormularioVenta = true;
    }
  }
}
