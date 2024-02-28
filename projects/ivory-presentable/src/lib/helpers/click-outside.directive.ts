import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[presentableClickOutside]'
})
export class ClickOutsideDirective {

  constructor(
    private elementRef: ElementRef
  ) { }

  @Output() clickOutside = new EventEmitter<Event>();

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.clickOutside.emit(event);
    }
  }

}
