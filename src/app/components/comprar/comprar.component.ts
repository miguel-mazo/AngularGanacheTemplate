import { Component, OnInit, PipeTransform } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  fechaMatricula: string = '';
  ERROR_CAMPO_OBLIGATORIO = CAMPO_OBLIGATORIO;
  vehiculoExistente = false;
  token: string = ''

  constructor(private web3Service: Web3Service, private formBuilder: FormBuilder) { }

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
    this.obtenerDatosBasicosVehiculo();
    this.obtenerDetallesVehiculo();
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

  convertirSegundosAFecha(segundosString: string): string {
    const segundos = parseInt(segundosString, 10);

    const fecha = new Date(segundos * 1000);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();

    return `${dia}/${mes}/${anio}`;
  }
}
