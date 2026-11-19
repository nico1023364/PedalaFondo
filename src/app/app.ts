import { Component, signal } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


// Importar todos los componentes
import { ComunidadCiclistaComponent } from './comunidad-ciclista/comunidad-ciclista';
import { BannerComponent } from './banner/banner';
import { RuedaConNosotrosComponent } from './rueda-con-nosotros/rueda-con-nosotros';
import { MultimediaComponent } from './multimedia/multimedia';
import { PlanesComponent } from './planes/planes';
import { NoticiasComponent } from './noticias/noticias';
import { CompetenciasComponent } from './competencias/competencias';
import { ContactoComponent } from './contacto/contacto';
import { FooterComponent } from './footer/footer';
import { HeaderComponent } from './header/header';
import { AdquirirPlanes } from './adquirir-planes/adquirir-planes'; // Componente del formulario
import { GraciasComponent } from './gracias/gracias'; // Componente de agradecimiento

// Definir las rutas
const routes: Routes = [
  { path: 'adquirir-planes', component: AdquirirPlanes },
  { path: 'gracias', component: GraciasComponent },
  { path: '', redirectTo: '/adquirir-planes', pathMatch: 'full' }
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    ComunidadCiclistaComponent,
    BannerComponent,
    RuedaConNosotrosComponent,
    MultimediaComponent,
    PlanesComponent,
    NoticiasComponent,
    CompetenciasComponent,
    ContactoComponent,
    FooterComponent,
    HeaderComponent,// Habilitar las rutas aquí
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('myapp');
}
