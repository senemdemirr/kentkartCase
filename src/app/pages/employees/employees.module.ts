import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule , Routes} from '@angular/router';
import { EmployeesComponent } from './employees.component';
import {MatTableModule} from '@angular/material/table';


const routes: Routes = [
  { path: '', component: EmployeesComponent }, // Lazy load ile eşleştirme
];
@NgModule({
  declarations: [EmployeesComponent],
  imports: [RouterModule.forChild(routes), CommonModule, MatTableModule],
  exports: [EmployeesComponent, RouterModule],
})
export class EmployeesModule {}
