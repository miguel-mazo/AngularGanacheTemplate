import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  @Input() cuenta: any;
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  esCollapsed = false;
  esVenderVehiculo = false;

  @Input() esAdministrador!: boolean;

  constructor() { }

  ngOnInit() {
  }

  toggleMenu() {
    this.sidenav.open();
    this.esCollapsed = !this.esCollapsed;
  }
}
