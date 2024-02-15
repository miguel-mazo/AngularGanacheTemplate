import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Vehiculo } from 'src/app/models/vehiculo.model';
import { Web3Service } from 'src/app/services/web3.service';
import { CLASES_CONSTANTS } from 'src/assets/constantes/clases.constants';
import { COMBUSTUBLES_CONSTANTS } from 'src/assets/constantes/combustibles.constants';
import { CAMPO_OBLIGATORIO } from 'src/assets/constantes/errores.constants';
import { SERVICIOS_CONSTANTS } from 'src/assets/constantes/servicios.constants';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent implements OnInit {

  formulario!: FormGroup;

  vehiculo: Vehiculo = {
    placa: '',
    numeroMotor: '',
    numeroChasis: '',
    VIN: '',
    marca: '',
    clase: '',
    linea: '',
    modelo: '',
    color: '',
    cilindraje: '',
    potencia: '',
    capacidad: '',
    servicio: '',
    carroceria: '',
    combustible: '',
  };

  clases = CLASES_CONSTANTS;
  combustibles = COMBUSTUBLES_CONSTANTS;
  servicios = SERVICIOS_CONSTANTS;
  ERROR_CAMPO_OBLIGATORIO = CAMPO_OBLIGATORIO;

  constructor(private web3Service: Web3Service, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.construirFormulario();
  }

  async enviarFormulario() {
    if (this.formulario.valid) {
      // Lógica para manejar la presentación del formulario
      console.log('Formulario válido. Datos:', this.formulario.value);
      // Agrega aquí la lógica para enviar o procesar los datos
      this.vehiculo = { ...this.vehiculo, ...this.formulario.value };
      console.log(this.vehiculo)

      this.registrarVehiculo();
    }
  }

  async registrarVehiculo(){
    this.web3Service.llenarDatosVehiculo(this.vehiculo);
  }

  // obtenerFechaActual(): string {
  //   const fechaActual = new Date();
  //   const dia = fechaActual.getDate().toString().padStart(2, '0');
  //   const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // Los meses en JavaScript son de 0 a 11
  //   const anio = fechaActual.getFullYear().toString();
  
  //   return `${dia}/${mes}/${anio}`;
  // }

  construirFormulario() {
    this.formulario = this.formBuilder.group({
      placa: ['', Validators.required],
      numeroMotor: ['', Validators.required],
      numeroChasis: ['', Validators.required],
      VIN: ['', Validators.required],
      marca: ['', Validators.required],
      clase: ['', Validators.required],
      linea: ['', Validators.required],
      modelo: ['', Validators.required],
      color: ['', Validators.required],
      combustible: ['', Validators.required],
      cilindraje: ['', Validators.required],
      potencia: ['', Validators.required],
      capacidad: ['', Validators.required],
      servicio: ['', Validators.required],
      carroceria: ['', Validators.required],
    });
  }
}
