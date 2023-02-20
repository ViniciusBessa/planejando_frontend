import {
  animate,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  animations: [
    trigger('alert', [
      transition(
        'void => *',
        animate(
          500,
          keyframes([
            style({ bottom: '-24px', opacity: 0, offset: 0 }),
            style({ bottom: '0px', opacity: 0.5, offset: 0.7 }),
            style({ bottom: '12px', opacity: 1, offset: 1 }),
          ])
        )
      ),
      transition(
        '* => void',
        animate(
          500,
          keyframes([
            style({ opacity: 1, offset: 0 }),
            style({ opacity: 0, offset: 1 }),
          ])
        )
      ),
    ]),
  ],
})
export class ContactComponent implements OnInit {
  form!: FormGroup;
  showAlert: boolean = false;

  @ViewChild('emailAnchor') emailAnchor!: ElementRef;

  constructor() {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = new FormGroup({
      subject: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(100),
      ]),

      message: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(20),
      ]),
    });
  }

  onSubmit(): void {
    if (!this.form.valid) return;

    (this.emailAnchor.nativeElement as HTMLAnchorElement).click();
  }

  getEmailHref(): string {
    const { subject, message } = this.form.value;
    return `mailto:planejando.website@gmail.com?subject=${subject}&body=${message}`;
  }
}
