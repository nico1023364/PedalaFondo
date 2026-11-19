import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService, Plan } from '../services/api.service';

@Component({
  selector: 'app-adquirir-planes',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './adquirir-planes.html',
  styleUrls: ['./adquirir-planes.css'],
})
export class AdquirirPlanes implements OnInit {
  name = '';
  lastname = '';
  phone = '';
  city = '';
  email = '';
  selectedPlan = '';

  sending = false;
  errorMessage = '';

  plans: Plan[] = [
    { name: 'Plan Rodada', price: '20.000', description: '' },
    { name: 'Plan Fondo', price: '30.000', description: '' },
    { name: 'Plan Pro', price: '50.000', description: '' }
  ];

  constructor(
    private readonly router: Router,
    private readonly api: ApiService,
  ) {}

  ngOnInit(): void {
    this.selectedPlan = this.plans[0].name;
    this.api.getPlanes().subscribe({
      next: (planes) => {
        if (!planes.length) return;
        this.plans = planes;
        if (!this.selectedPlan) this.selectedPlan = planes[0].name;
      },
      error: () => {
        // Sin base de datos disponible se usan los planes locales.
      },
    });
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (
      !this.name ||
      !this.lastname ||
      !this.phone ||
      !this.city ||
      !this.email ||
      !this.selectedPlan
    ) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    this.sending = true;
    this.api
      .crearInscripcion({
        nombre: this.name,
        apellidos: this.lastname,
        telefono: this.phone,
        ciudad: this.city,
        email: this.email,
        plan: this.selectedPlan,
      })
      .subscribe({
        next: () => {
          this.sending = false;
          this.router.navigate(['/gracias']);
        },
        error: (error) => {
          this.sending = false;
          this.errorMessage =
            error?.error?.message ||
            'No se pudo registrar la inscripción. Intenta de nuevo en unos minutos.';
        },
      });
  }
}
