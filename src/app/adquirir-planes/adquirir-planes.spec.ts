import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdquirirPlanes } from './adquirir-planes';

describe('AdquirirPlanes', () => {
  let component: AdquirirPlanes;
  let fixture: ComponentFixture<AdquirirPlanes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdquirirPlanes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdquirirPlanes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
