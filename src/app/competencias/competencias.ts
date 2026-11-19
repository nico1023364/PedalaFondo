import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-competencias',
  imports: [CommonModule], 
  templateUrl: './competencias.html',
  styleUrls: ['./competencias.css']
})
export class CompetenciasComponent {
  competitions = [
    { image: '/assets/images/tour.jpg',name: 'Tour de Francia', date: '2025', description: 'Considerado la competencia más importante del ciclismo de ruta. Cada año reúne a los mejores equipos y corredores del mundo. Sus etapas incluyen montaña, contrarreloj y recorridos planos que ponen a prueba todas las habilidades de un ciclista.Fue la edición 112 del Tour de Francia, disputada del 5 al 27 de julio de 2025.El recorrido cubrió 21 etapas y aproximadamente 3.320 km.Ganador del Tour: Tadej Pogačar (UAE Team Emirates-XRG), seguido por Jonas Vingegaard (Visma-Lease a Bike) en segundo lugar, y Florian Lipowitz (Red Bull-BORA-Hansgrohe) tercero' },
    { image: '/assets/images/giro.jpg',name: 'Giro de Italia', date: '2025', description: 'La edición 108 del Giro corrió del 9 de mayo al 1 de junio, comenzando en Durrës (Albania) y terminando en Roma.Fueron 21 etapas con ~3.443 kilómetros, un desnivel acumulado de unos 52.350-52.500 metros.Tuvo dos contrarrelojes individuales, varias etapas de montaña clave y tramos de ster­rato (terrenos de tierra), lo que añadió dificultad adicional para los ciclistas.Favoritos: se mencionaba a Primož Roglič, Juan Ayuso, Richard Carapaz, Mikel Landa entre otros. También sobresale la ausencia de Tadej Pogacar, lo que abrió más posibilidades para otros.' },
    { image: '/assets/images/vuelta.jpg',name: 'Vuelta a España', date: '2025', description: 'Ultima gran vuelta de la temporada, conocida por sus rampas extremas y el protagonismo de los ciclistas latinoamericanos.La Vuelta de 2025 es la edición 80 y promete ser una carrera montaña-pendiente, con muchos finales en alto, contrarrelojes (CRI) y etapas decisivas que favorecen a los escaladores.Algunos tramos clave que definirían la carrera: La Bola del Mundo (etapa de montaña exigente en la sierra de Guadarrama), el Angliru, etapas en Asturias, y una CRI importante.Favoritos y aspirantes: Jonas Vingegaard llega como candidato fuerte; Juan Ayuso y João Almeida también son nombres a tener en cuenta; Egan Bernal está en recuperación y equipo, intentando pelear.' }
  ];
}
