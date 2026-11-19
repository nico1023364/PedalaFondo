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
    { image: 'https://hosting.renderforestsites.com/28385989/1545028/media/0f15cd3cde6f6b7fb84140bfa38b5012.jpg', link: '#salvaje' },
    { image: 'https://hosting.renderforestsites.com/28385989/1545028/media/3f8263f1c90ca213cac689dd4fa46f3d.jpg', link: '#gf-bogota'},
    { image: 'https://hosting.renderforestsites.com/28385989/1545028/media/3ab75ee4960bfd2a7d2a1d57f30b6692.jpg', link: '#hikers' },
    { image: 'https://hosting.renderforestsites.com/28385989/1545028/media/5321edbe233e23a45122c34534100349.jpg', link: '#salvaje' },
    { image: 'https://hosting.renderforestsites.com/28385989/1545028/media/7e8d3c8483cb13b48ac5e25e1268f32e.jpg', link: '#salvaje' }
  ];
}
