import { LitElement, html, css } from 'lit';
import { store, deleteEmployee } from '../store.js';
import { i18n } from '../i18n/i18n.js';

import { Router } from '@vaadin/router';

export class EmployeeList extends LitElement {
  static styles = css`
    section { padding: 1rem; } 
    table { width: 100%; border-collapse: collapse; } 
    th, td { border: 1px solid #ccc; padding: 0.5rem; text-align: left; }
    .employee-card-container {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      width: 80%;
      margin: 20px auto;
    }
    .employee-card {
      background: #f6f6f6;
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }
    .employee-info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px 16px;
    }
    .employee-info-grid div {
      font-size: 14px;
      line-height: 1.4;
    }
    .employee-info-grid strong {
      color: #333;
    }`;

  constructor() {
    super();
    this.view = 'table';
    this.employees = store.getState().employees;

    // Redux subscribe
    store.subscribe(() => {
      this.employees = store.getState().employees;
      this.requestUpdate();
    });

    window.addEventListener('lang-changed', (e) => {
      this.lang = e.detail.lang;
      this.requestUpdate();
    });
  }

  changeView(view) {
    this.view = view;
    this.requestUpdate();
  }

  handleEditEmployee(emp) {
    const index = this.employees.findIndex(e => e === emp);
    if (index !== -1) {
      Router.go(`/add-edit-employee/${index}`);
    }
  }

  handleDeleteEmployee(emp) {
    const index = this.employees.findIndex(e => e === emp);
    if (index !== -1 && confirm(`${emp.firstName} ${emp.lastName} adlı çalışanı silmek istediğinize emin misiniz?`)) {
      store.dispatch(deleteEmployee(index));
    }
  }

  render() {
    return html`
      <section>
        <div style="display:flex; align-items:center; justify-content:space-between;">
          <h2 style="margin:0;">${i18n.t('employeeList')}</h2>
          <div style="display:flex; gap:0.5rem;">
            <button @click=${() => this.changeView('table')} title="Tablo Görünümü">📋</button>
            <button @click=${() => this.changeView('card')} title="Kart Görünümü">🗂️</button>
          </div>
        </div>

        ${this.view === 'table' ? html`
          <table>
            <thead>
              <tr>
                <th>Adı</th>
                <th>Soyadı</th>
                <th>İşe Giriş</th>
                <th>Doğum</th>
                <th>Telefon</th>
                <th>Email</th>
                <th>Departman</th>
                <th>Pozisyon</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              ${this.employees.map(emp => html`
                <tr>
                  <td>${emp.firstName}</td>
                  <td>${emp.lastName}</td>
                  <td>${emp.startDate}</td>
                  <td>${emp.birthDate}</td>
                  <td>${emp.phone}</td>
                  <td>${emp.email}</td>
                  <td>${emp.department}</td>
                  <td>${emp.position}</td>
                  <td>
                    <button @click=${() => this.handleEditEmployee(emp)}>Düzenle</button>
                    <button @click=${() => this.handleDeleteEmployee(emp)}>Sil</button>
                  </td>
                </tr>
              `)}
            </tbody>
          </table>
        ` : html`
          <div class="employee-card-container">
            ${this.employees.map(emp => html`
              <div class="employee-card">
                <div class="employee-info-grid">
                  <div><strong>Adı:</strong> ${emp.firstName}</div>
                  <div><strong>Soyadı:</strong> ${emp.lastName}</div>
                  <div><strong>İşe Giriş:</strong> ${emp.startDate}</div>
                  <div><strong>Doğum:</strong> ${emp.birthDate}</div>
                  <div><strong>Telefon:</strong> ${emp.phone}</div>
                  <div><strong>Email:</strong> ${emp.email}</div>
                  <div><strong>Departman:</strong> ${emp.department}</div>
                  <div><strong>Pozisyon:</strong> ${emp.position}</div>
                </div>
                <div style="margin-top:0.5rem; display:flex; gap:0.5rem;">
                  <button @click=${() => this.handleEditEmployee(emp)}>Düzenle</button>
                  <button @click=${() => this.handleDeleteEmployee(emp)}>Sil</button>
                </div>
              </div>
            `)}
          </div>
        `}
      </section>
    `;
  }
}

customElements.define('employee-list', EmployeeList);
