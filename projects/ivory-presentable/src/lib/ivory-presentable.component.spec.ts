import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IvoryPresentableComponent } from './ivory-presentable.component';

describe('IvoryPresentationComponent', () => {
  let component: IvoryPresentableComponent;
  let fixture: ComponentFixture<IvoryPresentableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IvoryPresentableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IvoryPresentableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
