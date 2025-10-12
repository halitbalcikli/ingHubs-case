import { LitElement, html, css } from 'lit';
import { store, deleteEmployee } from '../store.js';
import { i18n } from '../i18n/i18n.js';
import trashIcon from '../assets/icons/trash.svg';
import trashGridIcon from '../assets/icons/trash-grid.svg';
import editIcon from '../assets/icons/edit.svg';
import editGridIcon from '../assets/icons/edit-grid.svg';
import gridIcon from '../assets/icons/grid-gap.svg';
import menuIcon from '../assets/icons/menu.svg';
import { Router } from '@vaadin/router';

export class EmployeeList extends LitElement {
  static styles = css`
    section { background: #F1F2F7; height: 100vh;} 
    table { width: 100%; border-collapse: collapse; } 
    th, td { border: 1px solid #ccc; padding: 0.5rem; text-align: left; }
    .employee-card-container {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      width: 80%;
      margin: 20px auto;
    }
    .employee-list-container {
      width: 90%;
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
    }
    .employee-table-header {
      color: #FF6600;
      padding: 16px 16px;
      border-bottom: 1px solid #ccc; 
      border-top: none; 
      border-left: none; 
      border-right: none;
    }
    .employee-table {
      margin-top: 20px;
      background: #fff; 
      border-collapse: collapse
    }
    .employee-list-title {
      font-size: 24px;
      font-weight: bold;
      color: #FF6600;
    }
    input[type="checkbox"] {
      width: 16px;
      height: 16px;
      cursor: pointer;
      accent-color: #999;
    }
    .employee-table-cell {
      border-bottom: 1px solid #ccc;
      border-top: none;
      border-left: none;
      border-right: none;
    }
    .action-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .bulk-delete-button {
      background: #FF6600;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }
  `;

  constructor() {
    super();
    this.view = 'table';
    this.employees = store.getState().employees;
    this.selectedEmployees = new Set(); // Seçilen çalışanları tutar

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

  handleSelectEmployee(emp, event) {
    if (event.target.checked) {
      this.selectedEmployees.add(emp);
    } else {
      this.selectedEmployees.delete(emp);
    }
    this.requestUpdate();
  }

  handleSelectAll(event) {
    if (event.target.checked) {
      this.selectedEmployees = new Set(this.employees);
    } else {
      this.selectedEmployees.clear();
    }
    this.requestUpdate();
  }

  handleBulkDelete() {
    if (this.selectedEmployees.size === 0) {
      alert('Silmek için en az bir çalışan seçin.');
      return;
    }

    if (confirm(`${this.selectedEmployees.size} çalışanı silmek istediğinize emin misiniz?`)) {
      this.selectedEmployees.forEach(emp => {
        const index = this.employees.findIndex(e => e === emp);
        if (index !== -1) {
          store.dispatch(deleteEmployee(index));
        }
      });
      this.selectedEmployees.clear();
    }
  }

  render() {
    const allSelected = this.selectedEmployees.size === this.employees.length && this.employees.length > 0;

    return html`
      <section>
        <div class="employee-list-container">
          <div class="action-bar">
            <h2 class="employee-list-title">${i18n.t('employeeList')}</h2>
            <div style="display:flex; gap:0.5rem; align-items:center;">
              
              ${this.selectedEmployees.size > 0 ? html`<button class="bulk-delete-button" @click=${this.handleBulkDelete}>
                ${i18n.t('deleteSelected') || 'Seçilenleri Sil'}
              </button>` : ''}
              <img @click=${() => this.changeView('table')} src=${menuIcon} alt="Tablo Görünümü" style="width: 24px; height: 24px; cursor: pointer;" />
              <img @click=${() => this.changeView('card')} src=${gridIcon} alt="Kart Görünümü" style="width: 24px; height: 24px; cursor: pointer;" />
            </div>
          </div>

          ${this.view === 'table' ? html`
            <table class="employee-table">
              <thead>
                <tr class="employee-table-header">
                  <th class="employee-table-cell">
                    <input type="checkbox" @change=${this.handleSelectAll} .checked=${allSelected} />
                  </th>
                  <th class="employee-table-cell">${i18n.t('name')}</th>
                  <th class="employee-table-cell">${i18n.t('lastName')}</th>
                  <th class="employee-table-cell">${i18n.t('startDate')}</th>
                  <th class="employee-table-cell">${i18n.t('birthDate')}</th>
                  <th class="employee-table-cell">${i18n.t('phone')}</th>
                  <th class="employee-table-cell">${i18n.t('email')}</th>
                  <th class="employee-table-cell">${i18n.t('department')}</th>
                  <th class="employee-table-cell">${i18n.t('position')}</th>
                  <th class="employee-table-cell">${i18n.t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                ${this.employees.map(emp => html`
                  <tr class="employee-table-row">
                    <td class="employee-table-cell">
                      <input
                        style="width: 16px; height: 16px; cursor: pointer;"
                        type="checkbox"
                        .checked=${this.selectedEmployees.has(emp)}
                        @change=${(e) => this.handleSelectEmployee(emp, e)}
                      />
                    </td>
                    <td class="employee-table-cell">${emp.firstName}</td>
                    <td class="employee-table-cell">${emp.lastName}</td>
                    <td class="employee-table-cell">${emp.startDate}</td>
                    <td class="employee-table-cell">${emp.birthDate}</td>
                    <td class="employee-table-cell">${emp.phone}</td>
                    <td class="employee-table-cell">${emp.email}</td>
                    <td class="employee-table-cell">${emp.department}</td>
                    <td class="employee-table-cell">${emp.position}</td>
                    <td class="employee-table-cell">
                      <img @click=${() => this.handleEditEmployee(emp)} src=${editIcon} alt="Düzenle" style="width: 20px; height: 20px; cursor: pointer;" />
                      <img @click=${() => this.handleDeleteEmployee(emp)} src=${trashIcon} alt="Sil" style="width: 20px; height: 20px; cursor: pointer;" />
                    </td>
                  </tr>
                `)}
              </tbody>
            </table>
          ` : html`
            <!-- Kart görünümü aynı kalıyor -->
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
                    <button style="display:flex; align-items:center; justify-content:center; background: #091C5A; color: #fff; padding: 12px; border-radius: 4px; cursor: pointer;" class="edit-button" @click=${() => this.handleEditEmployee(emp)}>
                      <img src=${editGridIcon} alt="Düzenle" style="width: 20px; height: 20px;" />
                      ${i18n.t('edit')}
                    </button>
                    <button style="display:flex; align-items:center; justify-content:center; background: #FF6600; color: #fff; padding: 12px; border-radius: 4px; cursor: pointer;" class="delete-button" @click=${() => this.handleDeleteEmployee(emp)}>
                      <img src=${trashGridIcon} alt="Sil" style="width: 20px; height: 20px;" />
                      ${i18n.t('delete')}
                    </button>
                  </div>
                </div>
              `)}
            </div>
          `}
        </div>
      </section>
    `;
  }
}

customElements.define('employee-list', EmployeeList);
