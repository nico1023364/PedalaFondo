import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService, Inscripcion } from '../services/api.service';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
})
export class AdminComponent {
  token = '';
  inscriptions: Inscripcion[] = [];
  loading = false;
  loaded = false;
  errorMessage = '';

  constructor(private readonly api: ApiService) {}

  load(): void {
    const token = this.token.trim();
    if (!token) {
      this.errorMessage = 'Escribe el token de administración.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.api.getInscripciones(token).subscribe({
      next: (rows) => {
        this.inscriptions = rows;
        this.loading = false;
        this.loaded = true;
      },
      error: (error) => {
        this.inscriptions = [];
        this.loading = false;
        this.loaded = true;
        this.errorMessage =
          error?.status === 401
            ? 'Token incorrecto.'
            : error?.error?.message || 'No se pudo consultar la base de datos.';
      },
    });
  }
}
