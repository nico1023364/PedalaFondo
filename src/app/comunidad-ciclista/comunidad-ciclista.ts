import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-comunidad-ciclista',  
  imports: [CommonModule, RouterModule ],  
  templateUrl: './comunidad-ciclista.html',
  styleUrls: ['./comunidad-ciclista.css']
})
export class ComunidadCiclistaComponent {
 
  comunidadItems = [
    { title: 'RUTAS', description: 'Descubre y publica recorridos locales y nacionales para rodar en grupo.', image: '/assets/images/group-ride.jpg', link: '/', linkText: 'LINK APP STRAVA' },
    { title: 'WHATSAPP', description: 'Un espacio para resolver dudas, intercambiar consejos y hablar de todo lo que nos une: la bici.', image: '/assets/images/fans.jpg', link: '/',  linkText: 'LINK WHATSAPP' },
    { title: 'ENCUENTROS', description: 'Calendario con rodadas, competencias y encuentros ciclistas en Bogota- Colombia', image: '/assets/images/sprint.jpg', link: '/',  linkText: 'LINK CALENDARIO' }
  ];
}
