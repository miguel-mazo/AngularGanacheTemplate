import { Component, OnInit, PipeTransform } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HistorialVehiculo } from 'src/app/models/historial-vehiculo.model';
import { Web3Service } from 'src/app/services/web3.service';
import { CAMPO_OBLIGATORIO } from 'src/assets/constantes/errores.constants';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

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
  fechaMatricula!: string;
  ERROR_CAMPO_OBLIGATORIO = CAMPO_OBLIGATORIO;
  vehiculoExistente = false;
  token: string = '';
  direccionPropietarioActual?: string;
  historialVehiculo !: HistorialVehiculo[];

  constructor(private web3Service: Web3Service, private formBuilder: FormBuilder, private ngxLoader: NgxUiLoaderService, private datePipe: DatePipe) { }

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
      const token = this.formularioComprar.get('token');
      this.token = token?.value
      this.obtenerDatosVehiculo();
    }
  }

  async obtenerDatosVehiculo() {

    this.direccionPropietarioActual = await this.obtenerDireccionPropietarioActual();
    const propietarios = await this.web3Service.obtenerHistorialPropietariosVehiculo(this.token);
    const fechaEventos = await this.web3Service.obtenerHistorialFechasEventosVehiculo(this.token);
    await Promise.all([this.direccionPropietarioActual, propietarios, fechaEventos]);

    this.historialVehiculo = propietarios.slice(1).map((propietario: any, index: string | number) => ({
      propietario,
      fecha: new Date(fechaEventos[index] * 1000)
    }));

    if (await this.validarPropietario()) {

      if (!(await this.validarEstadoVentaVehiculo())) {

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
      this.fechaMatricula = this.datePipe.transform(this.datosBasicosVehiculo[9] * 1000, 'dd/MM/yyyy') || '';
      this.vehiculoExistente = true;
    } catch (error) {
      this.datosBasicosVehiculo = [];
      Swal.fire({
        icon: 'error',
        title: '¡Vehículo no registrado!',
        text: 'El vehículo asociado al token ' + this.token + ' aún no ha sido registrado'
      });
    }
  }

  async obtenerDetallesVehiculo() {
    try {
      this.detallesVehiculo = await this.web3Service.obtenerDetallesVehiculo(this.token);
    } catch (error) {
      this.detallesVehiculo = [];
    }
  }

  async obtenerPrecioVehiculo() {
    try {
      this.precioVehiculo = await this.web3Service.obtenerPrecioVehiculo(this.token);
    } catch (error) {
      this.precioVehiculo = 0;
    }
  }

  async comprarVehiculo() {
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

  async obtenerDireccionPropietarioActual() {
    return this.web3Service.obtenerPropietarioVehiculo(this.token);
  }

  async validarPropietario() {
    const cuentaActual = await this.web3Service.obtenerCuenta();

    if (cuentaActual === this.direccionPropietarioActual) {

      Swal.fire({
        icon: 'error',
        title: '¡Error al comprar el vehículo!',
        text: 'El vehículo asociado al token ' + this.token + ' ya es de su propiedad'
      });

      return false;
    } else {
      return true;
    }
  }

  async validarEstadoVentaVehiculo() {
    return await this.web3Service.obtenerEstadoVentaVehiculo(this.token);
  }
}
