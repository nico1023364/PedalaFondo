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
    { title: 'Ciclismo en Colombia', content: 'Nuevos talentos emergentes en el ciclismo nacional.', image: 'https://hosting.renderforestsites.com/28385989/1545028/media/9cffb50e54692498be83afa7a6756de9.png', link :'/noticias' },
    { title: 'Competencias internacionales', content: 'Tour de Francia 2025: resultados, análisis de etapas y desempeño de los colombianos.', image: 'https://hosting.renderforestsites.com/28385989/1545028/media/105c451ec91535b777fc69eb1bef3abc.png' }
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
