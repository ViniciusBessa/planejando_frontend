import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ContactComponent } from './contact.component';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactComponent],
      imports: [ReactiveFormsModule, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display the alert', () => {
    const alert = compiled.querySelector('span') as HTMLSpanElement;
    expect(component.showAlert).toBeFalse();
    expect(alert).toBeFalsy();
  });

  it('should display the alert', () => {
    component.showAlert = true;
    fixture.detectChanges();
    const alert = compiled.querySelector('span') as HTMLSpanElement;
    expect(component.showAlert).toBeTrue();
    expect(alert).toBeTruthy();
  });

  it('should fail to submit the form by not providing a name', fakeAsync(() => {
    spyOn(component, 'onSubmit');
    const messageForm = component.form;

    // Updating the form fields
    messageForm.patchValue({
      email: 'test@email.com',
      subject: 'A new subject',
      message: 'Just a message to test the functionality',
    });

    // Submitting the form
    const submitBtn = compiled.querySelector('button') as HTMLButtonElement;
    submitBtn.click();
    tick();
    expect(component.onSubmit).toHaveBeenCalled();
    expect(messageForm.valid).toBeFalse();
    expect(messageForm.get('name')?.valid).toBeFalse();
    expect(messageForm.get('email')?.valid).toBeTrue();
    expect(messageForm.get('subject')?.valid).toBeTrue();
    expect(messageForm.get('message')?.valid).toBeTrue();
  }));

  it('should fail to submit the form by providing a name too short', fakeAsync(() => {
    spyOn(component, 'onSubmit');
    const messageForm = component.form;

    // Updating the form fields
    messageForm.patchValue({
      name: 'Test',
      email: 'test@email.com',
      subject: 'A new subject',
      message: 'Just a message to test the functionality',
    });

    // Submitting the form
    const submitBtn = compiled.querySelector('button') as HTMLButtonElement;
    submitBtn.click();
    tick();
    expect(component.onSubmit).toHaveBeenCalled();
    expect(messageForm.valid).toBeFalse();
    expect(messageForm.get('name')?.valid).toBeFalse();
    expect(messageForm.get('email')?.valid).toBeTrue();
    expect(messageForm.get('subject')?.valid).toBeTrue();
    expect(messageForm.get('message')?.valid).toBeTrue();
  }));

  it('should fail to submit the form by providing a name too long', fakeAsync(() => {
    spyOn(component, 'onSubmit');
    const messageForm = component.form;

    // Updating the form fields
    messageForm.patchValue({
      name: 'TestingUser'.repeat(5),
      email: 'test@email.com',
      subject: 'A new subject',
      message: 'Just a message to test the functionality',
    });

    // Submitting the form
    const submitBtn = compiled.querySelector('button') as HTMLButtonElement;
    submitBtn.click();
    tick();
    expect(component.onSubmit).toHaveBeenCalled();
    expect(messageForm.valid).toBeFalse();
    expect(messageForm.get('name')?.valid).toBeFalse();
    expect(messageForm.get('email')?.valid).toBeTrue();
    expect(messageForm.get('subject')?.valid).toBeTrue();
    expect(messageForm.get('message')?.valid).toBeTrue();
  }));

  it('should fail to submit the form by not providing an email', fakeAsync(() => {
    spyOn(component, 'onSubmit');
    const messageForm = component.form;

    // Updating the form fields
    messageForm.patchValue({
      name: 'TestingUser',
      subject: 'A new subject',
      message: 'Just a message to test the functionality',
    });

    // Submitting the form
    const submitBtn = compiled.querySelector('button') as HTMLButtonElement;
    submitBtn.click();
    tick();
    expect(component.onSubmit).toHaveBeenCalled();
    expect(messageForm.valid).toBeFalse();
    expect(messageForm.get('name')?.valid).toBeTrue();
    expect(messageForm.get('email')?.valid).toBeFalse();
    expect(messageForm.get('subject')?.valid).toBeTrue();
    expect(messageForm.get('message')?.valid).toBeTrue();
  }));

  it('should fail to submit the form by providing an invalid email', fakeAsync(() => {
    spyOn(component, 'onSubmit');
    const messageForm = component.form;

    // Updating the form fields
    messageForm.patchValue({
      name: 'TestingUser',
      email: 'email',
      subject: 'A new subject',
      message: 'Just a message to test the functionality',
    });

    // Submitting the form
    const submitBtn = compiled.querySelector('button') as HTMLButtonElement;
    submitBtn.click();
    tick();
    expect(component.onSubmit).toHaveBeenCalled();
    expect(messageForm.valid).toBeFalse();
    expect(messageForm.get('name')?.valid).toBeTrue();
    expect(messageForm.get('email')?.valid).toBeFalse();
    expect(messageForm.get('subject')?.valid).toBeTrue();
    expect(messageForm.get('message')?.valid).toBeTrue();
  }));

  it('should fail to submit the form by not providing a subject', fakeAsync(() => {
    spyOn(component, 'onSubmit');
    const messageForm = component.form;

    // Updating the form fields
    messageForm.patchValue({
      name: 'TestingUser',
      email: 'test@email.com',
      message: 'Just a message to test the functionality',
    });

    // Submitting the form
    const submitBtn = compiled.querySelector('button') as HTMLButtonElement;
    submitBtn.click();
    tick();
    expect(component.onSubmit).toHaveBeenCalled();
    expect(messageForm.valid).toBeFalse();
    expect(messageForm.get('name')?.valid).toBeTrue();
    expect(messageForm.get('email')?.valid).toBeTrue();
    expect(messageForm.get('subject')?.valid).toBeFalse();
    expect(messageForm.get('message')?.valid).toBeTrue();
  }));

  it('should fail to submit the form by providing a subject too short', fakeAsync(() => {
    spyOn(component, 'onSubmit');
    const messageForm = component.form;

    // Updating the form fields
    messageForm.patchValue({
      name: 'TestingUser',
      email: 'test@email.com',
      subject: 'Subject',
      message: 'Just a message to test the functionality',
    });

    // Submitting the form
    const submitBtn = compiled.querySelector('button') as HTMLButtonElement;
    submitBtn.click();
    tick();
    expect(component.onSubmit).toHaveBeenCalled();
    expect(messageForm.valid).toBeFalse();
    expect(messageForm.get('name')?.valid).toBeTrue();
    expect(messageForm.get('email')?.valid).toBeTrue();
    expect(messageForm.get('subject')?.valid).toBeFalse();
    expect(messageForm.get('message')?.valid).toBeTrue();
  }));

  it('should fail to submit the form by providing a subject too long', fakeAsync(() => {
    spyOn(component, 'onSubmit');
    const messageForm = component.form;

    // Updating the form fields
    messageForm.patchValue({
      name: 'TestingUser',
      email: 'test@email.com',
      subject: 'Subject'.repeat(20),
      message: 'Just a message to test the functionality',
    });

    // Submitting the form
    const submitBtn = compiled.querySelector('button') as HTMLButtonElement;
    submitBtn.click();
    tick();
    expect(component.onSubmit).toHaveBeenCalled();
    expect(messageForm.valid).toBeFalse();
    expect(messageForm.get('name')?.valid).toBeTrue();
    expect(messageForm.get('email')?.valid).toBeTrue();
    expect(messageForm.get('subject')?.valid).toBeFalse();
    expect(messageForm.get('message')?.valid).toBeTrue();
  }));

  it('should fail to submit the form by not providing a message', fakeAsync(() => {
    spyOn(component, 'onSubmit');
    const messageForm = component.form;

    // Updating the form fields
    messageForm.patchValue({
      name: 'TestingUser',
      email: 'test@email.com',
      subject: 'A new subject',
    });

    // Submitting the form
    const submitBtn = compiled.querySelector('button') as HTMLButtonElement;
    submitBtn.click();
    tick();
    expect(component.onSubmit).toHaveBeenCalled();
    expect(messageForm.valid).toBeFalse();
    expect(messageForm.get('name')?.valid).toBeTrue();
    expect(messageForm.get('email')?.valid).toBeTrue();
    expect(messageForm.get('subject')?.valid).toBeTrue();
    expect(messageForm.get('message')?.valid).toBeFalse();
  }));

  it('should fail to submit the form by providing a message too short', fakeAsync(() => {
    spyOn(component, 'onSubmit');
    const messageForm = component.form;

    // Updating the form fields
    messageForm.patchValue({
      name: 'TestingUser',
      email: 'test@email.com',
      subject: 'A new subject',
      message: 'Message',
    });

    // Submitting the form
    const submitBtn = compiled.querySelector('button') as HTMLButtonElement;
    submitBtn.click();
    tick();
    expect(component.onSubmit).toHaveBeenCalled();
    expect(messageForm.valid).toBeFalse();
    expect(messageForm.get('name')?.valid).toBeTrue();
    expect(messageForm.get('email')?.valid).toBeTrue();
    expect(messageForm.get('subject')?.valid).toBeTrue();
    expect(messageForm.get('message')?.valid).toBeFalse();
  }));

  it('should submit the form successfully', fakeAsync(() => {
    spyOn(component, 'onSubmit');
    const messageForm = component.form;

    // Updating the form fields
    messageForm.patchValue({
      name: 'TestingUser',
      email: 'test@email.com',
      subject: 'A new subject',
      message: 'Just a message to test the functionality',
    });

    // Submitting the form
    const submitBtn = compiled.querySelector('button') as HTMLButtonElement;
    submitBtn.click();
    tick();
    expect(component.onSubmit).toHaveBeenCalled();
    expect(messageForm.valid).toBeTrue();
    expect(messageForm.get('name')?.valid).toBeTrue();
    expect(messageForm.get('email')?.valid).toBeTrue();
    expect(messageForm.get('subject')?.valid).toBeTrue();
    expect(messageForm.get('message')?.valid).toBeTrue();
  }));
});
