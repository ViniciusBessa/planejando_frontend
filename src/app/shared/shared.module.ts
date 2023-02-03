import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntersectionObserverDirective } from './intersection-observer.directive';

@NgModule({
  declarations: [IntersectionObserverDirective],
  imports: [CommonModule],
  exports: [IntersectionObserverDirective],
})
export class SharedModule {}
