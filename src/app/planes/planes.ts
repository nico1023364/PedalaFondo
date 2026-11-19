import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService, Plan } from '../services/api.service';

@Component({
  selector: 'app-planes',
  imports: [CommonModule, RouterModule],
  templateUrl: './planes.html',
  styleUrl: './planes.css',
})
export class PlanesComponent implements OnInit {
  plans: Plan[] = [
    { name: 'Plan Rodada', description: 'Inicia en el ciclismo con rutinas básicas y progresivas. Incluye: rutinas básicas, tips de nutrición y progresión semanal.', price: '20.000' },
    { name: 'Plan Fondo', description: 'Aumenta tu resistencia con entrenos de fuerza y rutas largas. Incluye: entrenos de fuerza, rutas largas guiadas y seguimiento mensual.', price: '30.000' },
    { name: 'Plan Pro', description: '“El nivel más alto, para quienes buscan competir o alcanzar su mejor versión.” Incluye: planificación avanzada, asesoría en potencia y análisis de datos.', price: '50.000' }
  ];

  constructor(private readonly api: ApiService) {}

  ngOnInit(): void {
    this.api.getPlanes().subscribe({
      next: (planes) => {
        if (planes.length) this.plans = planes;
      },
      error: () => {
        // Sin base de datos disponible se mantienen los planes locales.
      },
    });
  }
}
