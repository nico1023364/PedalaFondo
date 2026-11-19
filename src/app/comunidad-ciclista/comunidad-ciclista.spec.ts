import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComunidadCiclista } from './comunidad-ciclista';

describe('ComunidadCiclista', () => {
  let component: ComunidadCiclista;
  let fixture: ComponentFixture<ComunidadCiclista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComunidadCiclista]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComunidadCiclista);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
