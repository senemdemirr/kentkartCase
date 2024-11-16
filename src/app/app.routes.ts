import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, 
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
  { path: 'employees', loadChildren: () => import('./pages/employees/employees.module').then(m => m.EmployeesModule) },
  { path: 'companies', loadChildren: () => import('./pages/companies/companies.module').then(m => m.CompaniesModule) },
  { path: '**', redirectTo: 'home' }, 
];
