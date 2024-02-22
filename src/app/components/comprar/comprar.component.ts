import { Component, OnInit, PipeTransform } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HistorialVehiculo } from 'src/app/models/historial-vehiculo.model';
import { Vehiculo } from 'src/app/models/vehiculo.model';
import { Web3Service } from 'src/app/services/web3.service';
import { CAMPO_OBLIGATORIO } from 'src/assets/constantes/errores.constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-comprar',
  templateUrl: './comprar.component.html',
  styleUrls: ['./comprar.component.css']
})
export class ComprarComponent implements OnInit {

  formularioComprar!: FormGroup;

  datosBasicosVehiculo: any = [];
  detallesVehiculo: any = [];
  precioVehiculo!: number;
  fechaMatricula: string = '';
  ERROR_CAMPO_OBLIGATORIO = CAMPO_OBLIGATORIO;
  vehiculoExistente = false;
  token: string = '';
  direccionPropietarioActual?: string;
  historialVehiculo !: HistorialVehiculo[];

  constructor(private web3Service: Web3Service, private formBuilder: FormBuilder, private ngxLoader: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.construirFormulario();
  }

  construirFormulario() {
    this.formularioComprar = this.formBuilder.group({
      token: ['', Validators.required]
    });
  }

  async enviarFormulario() {
    if (this.formularioComprar.valid) {
      this.vehiculoExistente = false;
      this.datosBasicosVehiculo = [];
      this.detallesVehiculo = [];
      // Lógica para manejar la presentación del formulario
      console.log('Formulario válido. Datos:', this.formularioComprar.value);
      // Agrega aquí la lógica para enviar o procesar los datos
      const token =  this.formularioComprar.get('token');
      this.token = token?.value
      this.obtenerDatosVehiculo();
    }
  }

  async obtenerDatosVehiculo() {

    this.direccionPropietarioActual = await this.obtenerDireccionPropietarioActual();
    const propietarios = await this.web3Service.obtenerHistorialPropietariosVehiculo(this.token);
    const fechaEventos = await this.web3Service.obtenerHistorialFechasEventosVehiculo(this.token);
    await Promise.all([this.direccionPropietarioActual, propietarios, fechaEventos]);

    console.log("historial: ", propietarios)
    console.log("fechas: ", fechaEventos)
    
    this.historialVehiculo = propietarios.slice(1).map((propietario: any, index: string | number) => ({
      propietario,
      fecha: new Date(fechaEventos[index]*1000)
    }));

    console.log("objeto Historial: ",  this.historialVehiculo)

    if(await this.validarPropietario()){

      if(!(await this.validarEstadoVentaVehiculo())){

        this.vehiculoExistente = false;
        this.datosBasicosVehiculo = [];
        this.detallesVehiculo = [];

        Swal.fire({
          icon: 'error',
          title: '¡El Vehículo no está en venta!',
          text: 'El vehículo asociado al token ' + this.token + ' no está en venta'
        });
      } else {
        this.vehiculoExistente = true;
        this.obtenerDatosBasicosVehiculo();
        this.obtenerDetallesVehiculo();
        this.obtenerPrecioVehiculo();
      }
    }
  }

  async obtenerDatosBasicosVehiculo() {
    try {
      this.datosBasicosVehiculo = await this.web3Service.obtenerDatosBasicosVehiculo(this.token);
      this.fechaMatricula = this.convertirSegundosAFecha(this.datosBasicosVehiculo[9]);
      console.log("Desde el comprar datosVehiculo es:", this.datosBasicosVehiculo)
      this.vehiculoExistente = true;
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
      console.log("Desde el comprar datosVehiculo es:", this.detallesVehiculo)
    } catch (error) {
      this.detallesVehiculo = [];
      // console.error('Error al obtener detalles del vehículo:', error);
    }
  }

  async obtenerPrecioVehiculo() {
    try {
      this.precioVehiculo = await this.web3Service.obtenerPrecioVehiculo(this.token);
      console.log("Desde el comprar el precio es:", this.precioVehiculo)
    } catch (error) {
      this.precioVehiculo = 0;
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

  async comprarVehiculo(){
    try {
      this.ngxLoader.start();
      const respuestaComprar = this.web3Service.comprarVehiculo(this.token);
      await Promise.all([respuestaComprar]);
      
      Swal.fire({
        icon: 'success',
        title: '¡Vehículo comprado!',
        text: 'El vehículo asociado al token ' + this.token + ' ya es de su propiedad'
      })

      this.vehiculoExistente = false;
      this.datosBasicosVehiculo = [];
      this.detallesVehiculo = [];

    } finally {
      this.ngxLoader.stop();
    }
  }

  async obtenerDireccionPropietarioActual(){
    return this.web3Service.obtenerPropietarioVehiculo(this.token);
  }

  async validarPropietario(){
    const cuentaActual = await this.web3Service.getAccount();

    if(cuentaActual === this.direccionPropietarioActual){

      // this.vehiculoExistente = false;

      Swal.fire({
        icon: 'error',
        title: '¡Error al comprar el vehículo!',
        text: 'El vehículo asociado al token ' + this.token + ' ya es de su propiedad'
      });

      return false;
    } else{
      // this.vehiculoExistente = true;

      return true;
    }
  }

  async validarEstadoVentaVehiculo(){
    return await this.web3Service.obtenerEstadoVentaVehiculo(this.token);
  }
}
