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
import '../components/confirm-modal.js'; 

export class EmployeeList extends LitElement {
  static styles = css`
    section { 
      background: #F1F2F7; 
      height: 100vh; 
      overflow-y: auto; 
    } 
    table { 
      width: 100%; 
      border-collapse: collapse; 
    } 
    th, td { 
      border: 1px solid #ccc; 
      padding: 0.5rem; 
      text-align: left; 
      font-size: 14px;
      white-space: nowrap;
    }
    .employee-card-container {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
      width: 85%;
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
      gap: 16px 16px;
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
      border-collapse: collapse;
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
      flex-wrap: wrap;
      gap: 10px;
    }
    .bulk-delete-button {
      background: #FF6600;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }
    @media (max-width: 1024px) {
      .employee-card-container {
        grid-template-columns: 1fr;
        width: 95%;
        gap: 16px;
      }
    }
    @media (max-width: 768px) {
      .employee-list-container {
        width: 100%;
        padding: 0 10px;
      }
      table {
        display: block;
        overflow-x: auto;
        white-space: nowrap;
      }
      th, td {
        font-size: 12px;
        padding: 8px;
      }
      .employee-list-title {
        font-size: 20px;
      }
      .bulk-delete-button {
        padding: 6px 12px;
        font-size: 12px;
      }
      .employee-card-container {
        grid-template-columns: 1fr;
        gap: 12px;
        width: 95%;
      }
      .employee-card {
        padding: 12px;
      }
      .employee-card button {
        font-size: 12px;
        padding: 6px 10px;
      }
      img[alt="Tablo Görünümü"], img[alt="Kart Görünümü"] {
        width: 20px;
        height: 20px;
      }
    }

    @media (max-width: 380px) {
      .employee-list-title {
        font-size: 18px;
      }
      .employee-card {
        padding: 10px;
      }
      .employee-info-grid div {
        font-size: 12px;
      }
      .bulk-delete-button {
        font-size: 11px;
        padding: 5px 10px;
      }
    }
  `;


  static properties = {
    view: { type: String },
    employees: { type: Array },
    selectedEmployees: { type: Object },
    currentPage: { type: Number },
    itemsPerPage: { type: Number },
    modalOpen: { type: Boolean },
    modalMessage: { type: String },
    deleteTarget: { type: Object }, 
  };

  constructor() {
    super();
    this.view = 'table';
    this.employees = store.getState().employees;
    this.selectedEmployees = new Set();

    this.currentPage = 1;
    this.itemsPerPage = 5;

    this.modalOpen = false;
    this.modalMessage = '';
    this.deleteTarget = null;

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
    this.modalOpen = true;
    this.modalMessage = `${emp.firstName} ${emp.lastName} adlı çalışanı silmek istediğinize emin misiniz?`;
    this.deleteTarget = { type: 'single', emp };
  }

  handleBulkDelete() {
    if (this.selectedEmployees.size === 0) {
      alert('Silmek için en az bir çalışan seçin.');
      return;
    }

    this.modalOpen = true;
    this.modalMessage = `${this.selectedEmployees.size} çalışanı silmek istediğinize emin misiniz?`;
    this.deleteTarget = { type: 'bulk' };
  }

  confirmDelete() {
    if (!this.deleteTarget) return;

    if (this.deleteTarget.type === 'single') {
      const emp = this.deleteTarget.emp;
      const index = this.employees.findIndex(e => e === emp);
      if (index !== -1) store.dispatch(deleteEmployee(index));
    } else if (this.deleteTarget.type === 'bulk') {
      this.selectedEmployees.forEach(emp => {
        const index = this.employees.findIndex(e => e === emp);
        if (index !== -1) store.dispatch(deleteEmployee(index));
      });
      this.selectedEmployees.clear();
    }

    this.modalOpen = false;
    this.deleteTarget = null;

    if (this.paginatedEmployees.length === 0 && this.currentPage > 1) {
      this.currentPage--;
    }
  }

  cancelDelete() {
    this.modalOpen = false;
    this.deleteTarget = null;
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
                ${this.paginatedEmployees.map(emp => html`
                  <tr>
                    <td class="employee-table-cell"><input type="checkbox" .checked=${this.selectedEmployees.has(emp)} @change=${(e) => this.handleSelectEmployee(emp, e)} /></td>
                    <td class="employee-table-cell">${emp.firstName}</td>
                    <td class="employee-table-cell">${emp.lastName}</td>
                    <td class="employee-table-cell">${emp.startDate}</td>
                    <td class="employee-table-cell">${emp.birthDate}</td>
                    <td class="employee-table-cell">${emp.phone}</td>
                    <td class="employee-table-cell">${emp.email}</td>
                    <td class="employee-table-cell">${emp.department}</td>
                    <td class="employee-table-cell">${emp.position}</td>
                    <td class="employee-table-cell">
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
                    <div><strong>${i18n.t('name')}:</strong> ${emp.firstName}</div>
                    <div><strong>${i18n.t('lastName')}:</strong> ${emp.lastName}</div>
                    <div><strong>${i18n.t('startDate')}:</strong> ${emp.startDate}</div>
                    <div><strong>${i18n.t('birthDate')}:</strong> ${emp.birthDate}</div>
                    <div><strong>${i18n.t('phone')}:</strong> ${emp.phone}</div>
                    <div><strong>${i18n.t('email')}:</strong> ${emp.email}</div>
                    <div><strong>${i18n.t('department')}:</strong> ${emp.department}</div>
                    <div><strong>${i18n.t('position')}:</strong> ${emp.position}</div>
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

          <confirm-modal
            .open=${this.modalOpen}
            .message=${this.modalMessage}
            @confirm=${this.confirmDelete}
            @cancel=${this.cancelDelete}
          ></confirm-modal>
        </div>
      </section>
    `;
  }
}

customElements.define('employee-list', EmployeeList);
