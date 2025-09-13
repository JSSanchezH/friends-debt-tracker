import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { FormComponent } from '../../../shared/form/form.component';
import { PopupComponent } from '../../../shared/popup/popup.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormComponent,
    PopupComponent,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  fields = [
    { name: 'email', placeholder: 'Correo electrónico', type: 'email' },
    { name: 'password', placeholder: 'Contraseña', type: 'password' },
  ];

  texts = {
    title: 'Iniciar Sesión',
    subtitle: 'Ingresa tu correo electrónico y contraseña para continuar',
    submitButton: 'Iniciar Sesión',
    linkText: '¿No tienes cuenta? Regístrate',
  };

  popupVisible = false;
  popupMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  showPopup(message: string) {
    this.popupMessage = message;
    this.popupVisible = true;
  }

  submit(): void {
    if (this.loginForm.invalid) {
      this.showPopup('Por favor completa todos los campos correctamente.');
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/debts']);
      },
      error: (err) => {
        console.error('Error al iniciar sesión', err);
        this.showPopup('Email o contraseña incorrectos.');
      },
    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
