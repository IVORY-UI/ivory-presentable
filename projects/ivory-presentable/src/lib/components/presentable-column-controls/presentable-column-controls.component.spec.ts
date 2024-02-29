import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentableColumnControlsComponent } from './presentable-column-controls.component';

describe('PresentableColumnControlsComponent', () => {
  let component: PresentableColumnControlsComponent;
  let fixture: ComponentFixture<PresentableColumnControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PresentableColumnControlsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PresentableColumnControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
