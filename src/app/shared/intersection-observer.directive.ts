import {
  Directive,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';

@Directive({
  selector: '[appIntersectionObserver]',
})
export class IntersectionObserverDirective implements OnInit, OnDestroy {
  @Input() root: HTMLElement | null = null;
  @Input() rootMargin = '0px 0px 0px 0px';
  @Input() threshold = 0.7;
  isVisible = false;
  observer: IntersectionObserver | undefined;

  constructor(private element: ElementRef) {}

  @HostBinding('class')
  className = 'transition-all duration-1000';

  @HostBinding('class.opacity-0')
  get invisible() {
    return !this.isVisible;
  }

  @HostBinding('class.opacity-100')
  get visible() {
    return this.isVisible;
  }

  ngOnInit(): void {
    // Starting the observer
    this.onObserve();
  }

  ngOnDestroy(): void {
    // Cleaning the observer on destroy
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  onObserve(): void {
    const options: IntersectionObserverInit = {
      root: this.root,
      rootMargin: this.rootMargin,
      threshold: this.threshold,
    };

    this.observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      this.isVisible = entry.isIntersecting;
    }, options);
    this.observer.observe(this.element.nativeElement);
  }
}
