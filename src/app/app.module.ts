import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SudokuComponent } from './sudoku/sudoku.component';
import { LoginComponent } from './login/login.component';
import {ButtonModule} from 'primeng/button';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {CardModule} from 'primeng/card';
import {TableModule} from 'primeng/table';
import {TabViewModule} from 'primeng/tabview';
import {InputTextModule} from 'primeng/inputtext';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {DialogModule} from 'primeng/dialog';
import {SelectButtonModule} from 'primeng/selectbutton';
import { GlobalService } from './global.service';
import { UserdashboardComponent } from './userdashboard/userdashboard.component';
import { DropdownModule } from 'primeng/dropdown';
import {KnobModule} from 'primeng/knob';
import { RegisterComponent } from './register/register.component';


@NgModule({
  declarations: [
    AppComponent,
    SudokuComponent,
    LoginComponent,
    UserdashboardComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    CardModule,
    TableModule,
    TabViewModule,
    InputTextModule,
    ToastModule,
    DialogModule,
    SelectButtonModule,
    DropdownModule,
    KnobModule
  ],
  providers: [MessageService,GlobalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
