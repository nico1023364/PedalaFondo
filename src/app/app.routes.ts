import { Routes } from '@angular/router';
import { AdquirirPlanes } from './adquirir-planes/adquirir-planes';
import { GraciasComponent } from './gracias/gracias';
import { HomeComponent } from './home/home';
import { AdminComponent } from './admin/admin';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // HOME
  { path: 'adquirir-planes', component: AdquirirPlanes },
  { path: 'gracias', component: GraciasComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '' },
];
