import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Debt } from '../models/debt.models';

@Injectable({
  providedIn: 'root',
})
export class DebtService {
  private baseUrl = 'http://localhost:3000/debts';

  constructor(private http: HttpClient) {}

  getDebts(filter?: 'paid' | 'pending'): Observable<Debt[]> {
    let url = this.baseUrl;
    if (filter === 'paid') url += '?paid=true';
    if (filter === 'pending') url += '?paid=false';
    return this.http.get<Debt[]>(url);
  }

  markAsPaid(id: string): Observable<Debt> {
    return this.http.patch<Debt>(`${this.baseUrl}/${id}/pay`, {});
  }

  getDebtById(id: string) {
    return this.http.get<Debt>(`${this.baseUrl}/${id}`);
  }
}
