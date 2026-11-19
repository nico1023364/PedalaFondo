import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterLink } from '@angular/router';  

@Component({
  selector: 'app-multimedia',
  imports: [CommonModule, RouterLink],  
  templateUrl: './multimedia.html',
  styleUrls: ['./multimedia.css']
})
export class MultimediaComponent {
  mediaItems = [
    { image: '/assets/images/gravel.jpg', link: '#salvaje' },
    { image: '/assets/images/mtb.jpg', link: '#gf-bogota'},
    { image: '/assets/images/women.jpg', link: '#hikers' },
    { image: '/assets/images/urban.jpg', link: '#salvaje' },
    { image: '/assets/images/track.jpg', link: '#salvaje' }
  ];
}
