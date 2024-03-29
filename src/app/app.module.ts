import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './components/auth/auth.component';
import { HeaderComponent } from './components/header/header.component';
import { TicketComponent } from './components/ticket/ticket.component';
import { TicketsComponent } from './components/tickets/tickets.component';
import { Web3Service } from './services/web3.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { VenderComponent } from './components/vender/vender.component';
import { RegistrarComponent } from './components/registrar/registrar.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NgxUiLoaderModule, NgxUiLoaderRouterModule } from 'ngx-ui-loader';
import { ComprarComponent } from './components/comprar/comprar.component';


@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HeaderComponent,
    TicketComponent,
    TicketsComponent,
    NavBarComponent,
    VenderComponent,
    RegistrarComponent,
    ComprarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTooltipModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    NgxUiLoaderModule,
    NgxUiLoaderRouterModule
  ],
  providers: [Web3Service],
  bootstrap: [AppComponent]
})
export class AppModule { }
