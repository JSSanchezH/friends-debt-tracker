import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DebtService } from '../../../services/debt.service';
import { Debt } from '../../../models/debt.models';
import { ButtonComponent } from '../../../shared/button/button.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-debt-detail',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ButtonComponent],
  templateUrl: './debt-detail.component.html',
  styleUrl: './debt-detail.component.css',
})
export class DebtDetailComponent {
  debtId!: string;
  debt?: Debt;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private debtService: DebtService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.debtId = this.route.snapshot.params['id'];
    this.loadDebt();
  }

  loadDebt(): void {
    this.debtService.getDebtById(this.debtId).subscribe({
      next: (res) => (this.debt = res),
      error: (err) => (this.errorMessage = 'No se pudo cargar la deuda'),
    });
  }

  goBack() {
    this.router.navigate(['/debts']);
  }
}
