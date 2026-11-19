import { Component } from '@angular/core';

@Component({
  selector: 'app-banner',
  standalone: true,  
  templateUrl: './banner.html',
  styleUrls: ['./banner.css'],
})
export class BannerComponent {
  title = 'KILOMETRO CERO';
  description = 'Noticias, rutas y entreno para ciclistas como tú.';
  textFinal = 'Porque cada kilómetro cuenta.';
}
