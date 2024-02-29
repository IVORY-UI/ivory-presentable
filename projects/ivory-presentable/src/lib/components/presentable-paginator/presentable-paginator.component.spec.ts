import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentablePaginatorComponent } from './presentable-paginator.component';

describe('PresentablePaginatorComponent', () => {
  let component: PresentablePaginatorComponent;
  let fixture: ComponentFixture<PresentablePaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PresentablePaginatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PresentablePaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
