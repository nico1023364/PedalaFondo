import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
declare var $: any; 

@Component({
  selector: 'app-noticias',
  imports: [CommonModule],
  templateUrl: './noticias.html',
  styleUrls: ['./noticias.css']
})
export class NoticiasComponent implements AfterViewInit{
  newsArticles = [
    { title: 'Ciclismo en Colombia', content: 'Nuevos talentos emergentes en el ciclismo nacional.', image: '/assets/images/fans.jpg', link :'/noticias' },
    { title: 'Competencias internacionales', content: 'Tour de Francia 2025: resultados, análisis de etapas y desempeño de los colombianos.', image: '/assets/images/tour.jpg' }
  ];

  ngAfterViewInit(): void {
    $('.owl-carousel').owlCarousel({
      loop: true,
      margin: 10,
      nav: false,
      dots: false,
      autoplay: true,
      autoplayTimeout: 7000,
      items : 1
    });
  }
}
