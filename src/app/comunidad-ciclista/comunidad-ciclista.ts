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
    { title: 'RUTAS', description: 'Descubre y publica recorridos locales y nacionales para rodar en grupo.', image: 'https://hosting.renderforestsites.com/28385989/1545028/media/8a8163e1643438730d2b5e9acf9e4fa0.jpg', link: '/', linkText: 'LINK APP STRAVA' },
    { title: 'WHATSAPP', description: 'Un espacio para resolver dudas, intercambiar consejos y hablar de todo lo que nos une: la bici.', image: 'https://hosting.renderforestsites.com/28385989/1545028/media/ffb024e9ed4398e30af71eb560f14cd4.jpg', link: '/',  linkText: 'LINK WHATSAPP' },
    { title: 'ENCUENTROS', description: 'Calendario con rodadas, competencias y encuentros ciclistas en Bogota- Colombia', image: 'https://hosting.renderforestsites.com/28385989/1545028/media/ccd114b8259dd3eae6c10b450278b4f3.png', link: '/',  linkText: 'LINK CALENDARIO' }
  ];
}
