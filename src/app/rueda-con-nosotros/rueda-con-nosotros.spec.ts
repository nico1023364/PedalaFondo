import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuedaConNosotros } from './rueda-con-nosotros';

describe('RuedaConNosotros', () => {
  let component: RuedaConNosotros;
  let fixture: ComponentFixture<RuedaConNosotros>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RuedaConNosotros]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RuedaConNosotros);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
