import { Component, OnInit } from '@angular/core';
import { ApiService, MultimediaItem } from '../services/api.service';

@Component({
  selector: 'app-multimedia',
  templateUrl: './multimedia.html',
  styleUrls: ['./multimedia.css'],
})
export class MultimediaComponent implements OnInit {
  mediaItems: MultimediaItem[] = [
    { image: '/assets/images/gravel.jpg', link: '#salvaje' },
    { image: '/assets/images/mtb.jpg', link: '#gf-bogota' },
    { image: '/assets/images/women.jpg', link: '#hikers' },
    { image: '/assets/images/urban.jpg', link: '#urban' },
    { image: '/assets/images/track.jpg', link: '#pista' }
  ];

  constructor(private readonly api: ApiService) {}

  ngOnInit(): void {
    this.api.getMultimedia().subscribe({
      next: (items) => {
        if (items.length) this.mediaItems = items;
      },
      error: () => {
        // Sin base de datos disponible se mantiene la galería local.
      },
    });
  }
}
