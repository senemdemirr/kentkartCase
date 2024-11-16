import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { HomeModule } from './pages/home/home.module';
import { EmployeesModule } from './pages/employees/employees.module';
import { CompaniesModule } from './pages/companies/companies.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from './components/components.module';
import { HeaderComponent } from './components/header/header.component';
import { appRoutes } from './app.routes';


@NgModule({
  declarations: [AppComponent, HeaderComponent],
  imports: [BrowserModule, MatButtonModule, FormsModule, ComponentsModule, MatIconModule, MatDialogModule, MatFormFieldModule, MatInputModule, BrowserAnimationsModule, CommonModule, HomeModule, EmployeesModule ,CompaniesModule,HttpClientModule, RouterModule.forRoot(appRoutes),MatTableModule], // HomeModule burada eklenir
  bootstrap: [AppComponent],
})
export class AppModule {}

