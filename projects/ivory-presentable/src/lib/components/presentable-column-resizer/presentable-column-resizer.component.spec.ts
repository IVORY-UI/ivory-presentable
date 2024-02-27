import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentableColumnResizerComponent } from './presentable-column-resizer.component';

describe('PresentableColumnResizerComponent', () => {
  let component: PresentableColumnResizerComponent;
  let fixture: ComponentFixture<PresentableColumnResizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PresentableColumnResizerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PresentableColumnResizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
