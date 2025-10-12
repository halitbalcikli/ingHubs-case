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

import '../components/pagination-component.js';

export class EmployeeList extends LitElement {
  static styles = css`
    section { background: #F1F2F7; height: 100vh; overflow-y:auto; } 
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
      padding: 1rem;
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

  static properties = {
    view: { type: String },
    employees: { type: Array },
    selectedEmployees: { type: Object },
    currentPage: { type: Number },
    itemsPerPage: { type: Number },
  };

  constructor() {
    super();
    this.view = 'table';
    this.employees = store.getState().employees;
    this.selectedEmployees = new Set();

    this.currentPage = 1;
    this.itemsPerPage = 5; 

    store.subscribe(() => {
      this.employees = store.getState().employees;
      this.requestUpdate();
    });

    window.addEventListener('lang-changed', (e) => {
      this.lang = e.detail.lang;
      this.requestUpdate();
    });
  }

  get paginatedEmployees() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.employees.slice(start, end);
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

      if (this.paginatedEmployees.length === 1 && this.currentPage > 1) {
        this.currentPage--;
      }
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
    const currentPageEmployees = this.paginatedEmployees;
    if (event.target.checked) {
      currentPageEmployees.forEach(emp => this.selectedEmployees.add(emp));
    } else {
      currentPageEmployees.forEach(emp => this.selectedEmployees.delete(emp));
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

  handlePageChange(e) {
    this.currentPage = e.detail.page;
    this.requestUpdate();
  }

  render() {
    const allSelected =
      this.paginatedEmployees.length > 0 &&
      this.paginatedEmployees.every(emp => this.selectedEmployees.has(emp));

    return html`
      <section>
        <div class="employee-list-container">
          <div class="action-bar">
            <h2 class="employee-list-title">${i18n.t('employeeList')}</h2>
            <div style="display:flex; gap:0.5rem; align-items:center;">
              ${this.selectedEmployees.size > 0 ? html`
                <button class="bulk-delete-button" @click=${this.handleBulkDelete}>
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
                  <th>${i18n.t('name')}</th>
                  <th>${i18n.t('lastName')}</th>
                  <th>${i18n.t('startDate')}</th>
                  <th>${i18n.t('birthDate')}</th>
                  <th>${i18n.t('phone')}</th>
                  <th>${i18n.t('email')}</th>
                  <th>${i18n.t('department')}</th>
                  <th>${i18n.t('position')}</th>
                  <th>${i18n.t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                ${this.paginatedEmployees.map(emp => html`
                  <tr>
                    <td><input type="checkbox" .checked=${this.selectedEmployees.has(emp)} @change=${(e) => this.handleSelectEmployee(emp, e)} /></td>
                    <td>${emp.firstName}</td>
                    <td>${emp.lastName}</td>
                    <td>${emp.startDate}</td>
                    <td>${emp.birthDate}</td>
                    <td>${emp.phone}</td>
                    <td>${emp.email}</td>
                    <td>${emp.department}</td>
                    <td>${emp.position}</td>
                    <td>
                      <img @click=${() => this.handleEditEmployee(emp)} src=${editIcon} style="width:20px; cursor:pointer;" />
                      <img @click=${() => this.handleDeleteEmployee(emp)} src=${trashIcon} style="width:20px; cursor:pointer;" />
                    </td>
                  </tr>
                `)}
              </tbody>
            </table>
          ` : html`
          
            <div class="employee-card-container">
              ${this.paginatedEmployees.map(emp => html`
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
                    <button style="background:#091C5A; color:white; padding:8px; border-radius:4px;" @click=${() => this.handleEditEmployee(emp)}>
                      <img src=${editGridIcon} style="width:18px; margin-right:4px;"> ${i18n.t('edit')}
                    </button>
                    <button style="background:#FF6600; color:white; padding:8px; border-radius:4px;" @click=${() => this.handleDeleteEmployee(emp)}>
                      <img src=${trashGridIcon} style="width:18px; margin-right:4px;"> ${i18n.t('delete')}
                    </button>
                  </div>
                </div>
              `)}
            </div>
          `}

          <pagination-component
            .totalItems=${this.employees.length}
            .itemsPerPage=${this.itemsPerPage}
            .currentPage=${this.currentPage}
            @page-change=${this.handlePageChange}
          ></pagination-component>
        </div>
      </section>
    `;
  }
}

customElements.define('employee-list', EmployeeList);
