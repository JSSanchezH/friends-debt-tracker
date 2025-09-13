import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DebtService } from '../../../services/debt.service';
import { HttpClientModule } from '@angular/common/http';
import { ButtonComponent } from '../../../shared/button/button.component';
import { PopupComponent } from '../../../shared/popup/popup.component';
import { Debt } from '../../../models/debt.models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-debt-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ButtonComponent, PopupComponent],
  templateUrl: './debt-list.component.html',
  styleUrls: ['./debt-list.component.css'],
})
export class DebtListComponent implements OnInit {
  debts: Debt[] = [];
  filter: 'all' | 'paid' | 'pending' = 'all';
  popupVisible = false;
  popupMessage = '';

  constructor(private debtService: DebtService, private router: Router) {}

  ngOnInit(): void {
    this.loadDebts();
  }

  loadDebts(): void {
    let filterQuery: 'paid' | 'pending' | undefined;
    if (this.filter === 'paid') filterQuery = 'paid';
    else if (this.filter === 'pending') filterQuery = 'pending';

    this.debtService.getDebts(filterQuery).subscribe({
      next: (res) => (this.debts = res),
      error: () => this.showPopup('Error cargando deudas.'),
    });
  }

  setFilter(filter: 'all' | 'paid' | 'pending') {
    this.filter = filter;
    console.log('Filter set to:', this.filter);
    this.loadDebts();
  }

  markPaid(debtId: string) {
    this.debtService.markAsPaid(debtId).subscribe({
      next: () => this.loadDebts(),
      error: () => this.showPopup('No se pudo marcar como pagada.'),
    });
  }

  viewDetail(debtId: string) {
    this.router.navigate(['/debts', debtId]);
  }
  showPopup(message: string) {
    this.popupMessage = message;
    this.popupVisible = true;
  }
}
