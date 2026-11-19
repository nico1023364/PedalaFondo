import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Plan {
  id?: number;
  name: string;
  description: string;
  price: string;
}

export interface Noticia {
  id?: number;
  title: string;
  content: string;
  image: string;
  link?: string | null;
  date?: string | null;
}

export interface Competencia {
  id?: number;
  name: string;
  date: string;
  description: string;
  image: string;
}

export interface MultimediaItem {
  id?: number;
  title?: string;
  image: string;
  link: string;
}

export interface NuevaInscripcion {
  nombre: string;
  apellidos: string;
  telefono: string;
  ciudad: string;
  email: string;
  plan: string;
}

export interface Inscripcion extends NuevaInscripcion {
  id: number;
  creadoEn: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly base = '/api';

  constructor(private readonly http: HttpClient) {}

  getPlanes(): Observable<Plan[]> {
    return this.http.get<Plan[]>(`${this.base}/planes`);
  }

  getNoticias(): Observable<Noticia[]> {
    return this.http.get<Noticia[]>(`${this.base}/noticias`);
  }

  getCompetencias(): Observable<Competencia[]> {
    return this.http.get<Competencia[]>(`${this.base}/competencias`);
  }

  getMultimedia(): Observable<MultimediaItem[]> {
    return this.http.get<MultimediaItem[]>(`${this.base}/multimedia`);
  }

  crearInscripcion(payload: NuevaInscripcion): Observable<{ id: number; creadoEn: string; message: string }> {
    return this.http.post<{ id: number; creadoEn: string; message: string }>(
      `${this.base}/inscripciones`,
      payload,
    );
  }

  getInscripciones(token: string, limit = 50): Observable<Inscripcion[]> {
    const headers = new HttpHeaders({ 'X-Admin-Token': token });
    return this.http.get<Inscripcion[]>(`${this.base}/inscripciones?limit=${limit}`, { headers });
  }
}
