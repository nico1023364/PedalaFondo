import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService, Noticia } from '../services/api.service';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.html',
  styleUrls: ['./noticias.css'],
})
export class NoticiasComponent implements OnInit, OnDestroy {
  newsArticles: Noticia[] = [
    { title: 'Ciclismo en Colombia', content: 'Nuevos talentos emergentes en el ciclismo nacional.', image: '/assets/images/fans.jpg', link: '/noticias' },
    { title: 'Competencias internacionales', content: 'Tour de Francia 2025: resultados, análisis de etapas y desempeño de los colombianos.', image: '/assets/images/tour.jpg', link: '/noticias' }
  ];

  current = 0;
  private timer?: ReturnType<typeof setInterval>;

  constructor(private readonly api: ApiService) {}

  get currentArticle(): Noticia | undefined {
    return this.newsArticles[this.current];
  }

  ngOnInit(): void {
    this.startAutoPlay();
    this.api.getNoticias().subscribe({
      next: (articles) => {
        if (!articles.length) return;
        this.newsArticles = articles;
        this.current = 0;
        this.startAutoPlay();
      },
      error: () => {
        // Sin base de datos disponible se mantienen las noticias locales.
      },
    });
  }

  show(index: number): void {
    this.current = index;
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  private startAutoPlay(): void {
    if (this.timer) clearInterval(this.timer);
    if (this.newsArticles.length < 2) return;
    this.timer = setInterval(() => {
      this.current = (this.current + 1) % this.newsArticles.length;
    }, 7000);
  }
}
