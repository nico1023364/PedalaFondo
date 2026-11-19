import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-rueda-con-nosotros',
  imports: [CommonModule, RouterModule], 
  templateUrl: './rueda-con-nosotros.html',
  styleUrl: './rueda-con-nosotros.css',
})
export class RuedaConNosotrosComponent {
  title = 'RUEDA CON NOSOTROS';
  description = 'Comparte tu pasión y conecta con ciclistas de todo el país';
  ctaText = 'ÚNETE';
  ctaLink = '/join';
}
