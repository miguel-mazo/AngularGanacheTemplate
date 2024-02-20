import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Vehiculo } from 'src/app/models/vehiculo.model';
import { Web3Service } from 'src/app/services/web3.service';
import { CLASES_CONSTANTS } from 'src/assets/constantes/clases.constants';
import { COMBUSTUBLES_CONSTANTS } from 'src/assets/constantes/combustibles.constants';
import { CAMPO_OBLIGATORIO } from 'src/assets/constantes/errores.constants';
import { SERVICIOS_CONSTANTS } from 'src/assets/constantes/servicios.constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent implements OnInit {

  formulario!: FormGroup;
  formularioConsultaContrato!: FormGroup;

  tokenContrato: string = '';
  contrato: any;

  contratoExistente = false;

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

  async enviarFormularioDatosVehiculo() {
    if (this.formulario.valid) {
      // Lógica para manejar la presentación del formulario
      console.log('Formulario válido. Datos:', this.formulario.value);
      // Agrega aquí la lógica para enviar o procesar los datos
      this.vehiculo = { ...this.vehiculo, ...this.formulario.value };
      console.log(this.vehiculo)

      this.registrarVehiculo();
    }
  }

  async enviarFormularioConsultaContrato() {
    if (this.formularioConsultaContrato.valid) {
      this.contratoExistente = false;
      this.vehiculo = {
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
      // Lógica para manejar la presentación del formulario
      console.log('Formulario válido. Token:', this.formularioConsultaContrato.value);
      // Agrega aquí la lógica para enviar o procesar los datos
      const token =  this.formularioConsultaContrato.get('token');
      this.tokenContrato = token?.value
      this.consultarContrato();
    }
  }

  async consultarContrato(){

    try {
      this.contrato = this.web3Service.obtenerContratoPorDireccionIngresada(this.tokenContrato);
      console.log("Contrato: ", this.contrato)
      const cantidadPropietariosContrato = await this.contrato.methods.obtenerTamanoHistorial().call();
      console.log("cantidad propietarios:", cantidadPropietariosContrato)      

      this.contratoExistente = true;
    } catch (error) {
      this.contratoExistente = false;
      this.vehiculo = {
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
      Swal.fire({
        icon: 'error',
        title: '¡Contrato no creado!',
        text: 'El contrato con dirección ' + this.tokenContrato + ' aún no ha sido creado'
      });
      // console.error('Error al obtener datos del vehículo:', error);
    }
  }

  async registrarVehiculo(){
    this.web3Service.llenarDatosVehiculo(this.tokenContrato, this.vehiculo, this.formulario.get('precio')?.value);
  }

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
      precio: [0, Validators.required]
    });

    this.formularioConsultaContrato = this.formBuilder.group({
      token: ['', Validators.required]
    });
  }
}
