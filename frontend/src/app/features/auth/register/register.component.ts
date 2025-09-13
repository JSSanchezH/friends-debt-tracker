import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RegisterRequest } from '../../../models/auth.models';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormComponent } from '../../../shared/form/form.component';
import { PopupComponent } from '../../../shared/popup/popup.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormComponent,
    PopupComponent,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm!: FormGroup;

  fields = [
    { name: 'email', placeholder: 'Correo electrónico', type: 'email' },
    { name: 'password', placeholder: 'Contraseña', type: 'password' },
  ];

  texts = {
    title: 'Registrarse',
    subtitle: 'Crea tu cuenta para empezar a usar la aplicación',
    submitButton: 'Registrarse',
    linkText: '¿Ya tienes cuenta? Inicia sesión',
  };

  popupVisible = false;
  popupMessage = '';
  popupType: 'success' | 'error' = 'success'; // para diferenciar colores

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  showPopup(message: string, type: 'success' | 'error' = 'error') {
    this.popupMessage = message;
    this.popupType = type;
    this.popupVisible = true;
  }

  submit(): void {
    if (this.registerForm.invalid) {
      this.showPopup(
        'Por favor completa todos los campos correctamente.',
        'error'
      );
      return;
    }

    const data: RegisterRequest = this.registerForm.value;

    this.authService.register(data).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.showPopup('¡Registro exitoso!, ahora inicia sesión', 'success');

        // Redireccionar después de 1.5 segundos
        setTimeout(() => {
          this.router.navigate(['/login']); // cambia la URL que quieras
          this.popupVisible = false;
        }, 1500);
      },
      error: (err) => {
        console.error('Error al registrar', err);
        this.showPopup('No se pudo registrar. Revisa los datos.', 'error');
      },
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
