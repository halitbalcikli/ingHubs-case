import { LitElement, html, css } from 'lit';
import { store } from '../store.js';
import { i18n } from '../i18n/i18n.js';

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

    // Redux subscribe ile reactive güncelleme
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
    this.requestUpdate(); // render'ı tetikler
  }

  render() {
    return html`
      <section>
        <div class="employee-list-container" style="display:flex; align-items:center; justify-content:space-between;">
          <h2 style="margin:0;">${i18n.t('employeeList')}</h2>
          <div style="display:flex; gap:0.5rem;">
            <!-- Table Icon -->
            <button @click=${() => this.changeView('table')} style="background:none; border:none; cursor:pointer;" title="Tablo Görünümü">
              <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="#444"><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="9" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="3" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/><rect x="15" y="9" width="6" height="6" rx="1"/><rect x="3" y="15" width="6" height="6" rx="1"/><rect x="9" y="15" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/></svg>
            </button>
            <!-- Card Icon -->
            <button @click=${() => this.changeView('card')} style="background:none; border:none; cursor:pointer;" title="Kart Görünümü">
              <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="#444"><rect x="4" y="6" width="16" height="12" rx="2"/><rect x="7" y="9" width="10" height="2" rx="1" fill="#888"/><rect x="7" y="13" width="6" height="2" rx="1" fill="#bbb"/></svg>
            </button>
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
              </tr>
            `)}
            ` : html`
              <div class="employee-card-container">
                ${this.employees.map(emp => html`
                  <div class="employee-card">
                    <div class="employee-info-grid">
                      <div><strong>First Name:</strong> ${emp.firstName}</div>
                      <div><strong>Last Name:</strong> ${emp.lastName}</div>
                      <div><strong>Start Date:</strong> ${emp.startDate}</div>
                      <div><strong>Birth Date:</strong> ${emp.birthDate}</div>
                      <div><strong>Phone:</strong> ${emp.phone}</div>
                      <div><strong>Email:</strong> ${emp.email}</div>
                      <div><strong>Department:</strong> ${emp.department}</div>
                      <div><strong>Position:</strong> ${emp.position}</div>
                    </div>
                  </div>
                `)}
              </div>
            `}
            </div>
          </tbody>
        </table>
      </section>
    `;
  }
}

customElements.define('employee-list', EmployeeList);
