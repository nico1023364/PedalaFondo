import { Component } from '@angular/core';

// Importa SOLO los componentes que usa el home
import { BannerComponent } from '../banner/banner';
import { RuedaConNosotrosComponent } from '../rueda-con-nosotros/rueda-con-nosotros';
import { MultimediaComponent } from '../multimedia/multimedia';
import { ComunidadCiclistaComponent } from '../comunidad-ciclista/comunidad-ciclista';
import { PlanesComponent } from '../planes/planes';
import { NoticiasComponent } from '../noticias/noticias';
import { CompetenciasComponent } from '../competencias/competencias';
import { ContactoComponent } from '../contacto/contacto';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  imports: [
    BannerComponent,
    RuedaConNosotrosComponent,
    MultimediaComponent,
    ComunidadCiclistaComponent,
    PlanesComponent,
    NoticiasComponent,
    CompetenciasComponent,
    ContactoComponent,
  ]
})
export class HomeComponent {}
