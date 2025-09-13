import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';
import { AuthField } from '../../models/auth.models';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
})
export class FormComponent {
  @Input() form!: FormGroup;
  @Input() texts!: {
    title: string;
    subtitle: string;
    submitButton: string;
    linkText?: string;
  };
  @Input() fields!: AuthField[];

  @Output() formSubmit = new EventEmitter<void>();
  @Output() linkClick = new EventEmitter<void>();
}
