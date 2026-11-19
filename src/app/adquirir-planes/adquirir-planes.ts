import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-adquirir-planes',
  standalone: true,
  imports: [FormsModule, CommonModule], 
  templateUrl: './adquirir-planes.html',
  styleUrls: ['./adquirir-planes.css'],
})
export class AdquirirPlanes {

  name: string = '';
  lastname: string = '';
  phone: string = '';
  city: string = '';
  email: string = '';
  selectedPlan: string = '';

  plans = [
    { name: 'Plan Rodada', price: '20.000' },
    { name: 'Plan Fondo', price: '30.000' },
    { name: 'Plan Pro', price: '50.000' }
  ];

  constructor(private router: Router) {}

  onSubmit(): void {
    if (
      this.name &&
      this.lastname &&
      this.phone &&
      this.city &&
      this.email &&
      this.selectedPlan
    ) {

      console.log('Formulario enviado:', {
        name: this.name,
        lastname: this.lastname,
        phone: this.phone,
        city: this.city,
        email: this.email,
        selectedPlan: this.selectedPlan
      });

      this.router.navigate(['/gracias']);
    } else {
      alert('Por favor, complete todos los campos.');
    }
  }
}
