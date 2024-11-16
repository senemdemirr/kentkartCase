import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule ,Routes} from '@angular/router';
import { CompaniesComponent } from './companies.component';
import {MatTableModule} from '@angular/material/table';


const routes: Routes = [
  { path: '', component: CompaniesComponent }, // Lazy load ile eşleştirme
];

@NgModule({
  declarations: [CompaniesComponent],
  imports: [RouterModule.forChild(routes), CommonModule,MatTableModule],
  exports: [CompaniesComponent],
})
export class CompaniesModule {}
