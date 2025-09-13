import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css'],
})
export class PopupComponent {
  @Input() message: string = ''; // Mensaje a mostrar
  @Input() visible: boolean = false; // Controla si se muestra
  @Output() close = new EventEmitter<void>(); // Evento al cerrar

  onClose() {
    this.visible = false;
    this.close.emit();
  }
}
