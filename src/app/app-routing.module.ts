import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SudokuComponent } from './sudoku/sudoku.component';
import { LoginComponent } from './login/login.component';
import { UserdashboardComponent } from './userdashboard/userdashboard.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {
    path:"",
    component: RegisterComponent
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path:"dashboard",
    component: UserdashboardComponent
  },
  {
    path: "sudoku",
    component: SudokuComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
