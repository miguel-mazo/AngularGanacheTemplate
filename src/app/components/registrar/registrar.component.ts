import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
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

  constructor(private web3Service: Web3Service, private formBuilder: FormBuilder, private ngxLoader: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.construirFormulario();
  }

  async enviarFormularioDatosVehiculo() {
    if (this.formulario.valid) {
      try {
        this.ngxLoader.start();
        this.vehiculo = { ...this.vehiculo, ...this.formulario.value };

        if (await this.registrarVehiculo()) {

          this.contratoExistente = false;

          Swal.fire({
            icon: 'success',
            title: 'Vehículo registrado',
            text: 'El token del vehículo es: ' + this.tokenContrato
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error al registrar vehículo'
          });
        }

      } finally {
        this.ngxLoader.stop();
      }
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
      const token = this.formularioConsultaContrato.get('token');
      this.tokenContrato = token?.value
      this.consultarContrato();
    }
  }

  async consultarContrato() {

    try {
      this.contrato = this.web3Service.obtenerContratoPorDireccionIngresada(this.tokenContrato);
      const cantidadPropietariosContrato = await this.contrato.methods.obtenerTamanoHistorial().call();
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
    }
  }

  async registrarVehiculo() {
    return this.web3Service.llenarDatosVehiculo(this.tokenContrato, this.vehiculo, this.formulario.get('precio')?.value);
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
      precio: [, Validators.required]
    });

    this.formularioConsultaContrato = this.formBuilder.group({
      token: ['', Validators.required]
    });
  }
}