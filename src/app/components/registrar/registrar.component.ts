import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Web3Service } from 'src/app/services/web3.service';
import { CLASES_CONSTANTS } from 'src/assets/constantes/clases.constants';
import { COMBUSTUBLES_CONSTANTS } from 'src/assets/constantes/combustibles.constants';
import { BYTECODE } from 'src/assets/constantes/contrato-vehiculo.constants';
import { CAMPO_OBLIGATORIO } from 'src/assets/constantes/errores.constants';
import { SERVICIOS_CONSTANTS } from 'src/assets/constantes/servicios.constants';

interface FormularioDatos {
  Placa: string;
  NúmeroMotor: string;
  NúmeroChasis: string;
  NúmeroSerie: string;
  VIN: string;
  Marca: string;
  Línea: string;
  Modelo: string;
  Color: string;
  Cilindraje: number;
  Potencia: number;
  Capacidad: number;
  Servicio: string;
  Carrocería: string;
  Combustible: string;
  Clase: string;
}

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent implements OnInit {

  formulario!: FormGroup;

  clases = CLASES_CONSTANTS;
  combustibles = COMBUSTUBLES_CONSTANTS;
  servicios = SERVICIOS_CONSTANTS;
  ERROR_CAMPO_OBLIGATORIO = CAMPO_OBLIGATORIO;

  constructor(private web3Service: Web3Service, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.construirFormulario();
  }

  async publicarVehiculo(){
    
    this.web3Service.desplegarContrato();
  }

  enviarFormulario() {
    if (this.formulario.valid) {
      // Lógica para manejar la presentación del formulario
      console.log('Formulario válido. Datos:', this.formulario.value);
      // Agrega aquí la lógica para enviar o procesar los datos
    }
  }

  construirFormulario() {
    this.formulario = this.formBuilder.group({
      placa: ['', Validators.required],
      numeroMotor: ['', Validators.required],
      numeroChasis: ['', Validators.required],
      numeroSerie: ['', Validators.required],
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
