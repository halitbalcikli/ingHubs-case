import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import { i18n } from '../i18n/i18n.js';

import '../components/form-field.js';

import { store, addEmployee, updateEmployee } from '../store.js';

export class AddEditEmployee extends LitElement {
  static styles = css`
    section { 
      background: #F1F2F7; 
      height: 100vh; 
      overflow-y: auto; 
    }
    .container {
      width: 80%; 
      margin: 40px auto; 
      max-width: 1100px;
    }
    h2 {
      color: #FF6600;
      margin-bottom: 1.5rem;
      text-align: left;
      padding-left: 0.5rem;
      font-size: 1.6rem;
    }
    form {
      background: #fff; 
      padding: 2.5rem; 
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
    }
    .row {
      display: flex;
      flex-wrap: wrap; 
      justify-content: flex-start;
      align-items: flex-start;
      gap: 2rem;
      margin-bottom: 2rem;
    }
    form-field {
      flex: 0 0 calc((100% - 4rem) / 3); 
      box-sizing: border-box;
    }
    @media (max-width: 900px) {
      form-field {
        flex: 0 0 calc((100% - 2rem) / 2);
      }
    }
    @media (max-width: 600px) {
      form-field {
        flex: 0 0 100%;
      }
    }
    .actions {
      display: flex;
      justify-content: center;
      margin-top: 2rem;
      gap: 1rem;
    }
    button {
      padding: 0.7rem 1.5rem;
      background: #FF6600;
      color: #fff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.2s ease-in-out;
    }
    .save-button {
      background: #FF6600;
      color: #fff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      width: 20%;
    }
    .cancel-button {
      background: #FFF;
      color: #000;
      border-color: #7f03fc;
      border-style: solid;
      border-radius: 6px;
      cursor: pointer;
      width: 20%;
    }
  `;

  constructor() {
    super();
    this.employee = {
      firstName: '',
      lastName: '',
      startDate: '',
      birthDate: '',
      phone: '',
      email: '',
      department: '',
      position: ''
    };
    this.positions = ['Junior', 'Mid', 'Senior'];
    this.editIndex = null;

    window.addEventListener('lang-changed', (e) => {
      this.lang = e.detail.lang;
      this.requestUpdate();
    });
  }

  // ✅ @vaadin/router buraya location bilgisini geçirir
  onBeforeEnter(location) {
    const id = location.params.id;
    if (id !== undefined) {
      this.editIndex = parseInt(id);
      const employees = store.getState().employees;
      const emp = employees[this.editIndex];
      if (emp) {
        this.employee = { ...emp };
      }
    }
  }

  _updateField(key, e) {
    this.employee[key] = e.detail?.value ?? e.target.value;
    this.requestUpdate();
  }

  _submit(e) {
    e.preventDefault();
    const formFields = this.shadowRoot.querySelectorAll('form-field');
    let isValid = true;
    formFields.forEach(field => { if (!field.validate()) isValid = false; });

    if (!isValid) {
      alert('Lütfen tüm alanları doğru doldurun.');
      return;
    }

    if (this.editIndex !== null) {
      store.dispatch(updateEmployee({ index: this.editIndex, data: this.employee }));
      alert('Çalışan bilgisi güncellendi!');
    } else {
      store.dispatch(addEmployee(this.employee));
      alert('Yeni çalışan eklendi!');
    }

    Router.go('/');
  }

  _cancel() {
    Router.go('/');
  }

  render() {
    const isEdit = this.editIndex !== null;
    return html`
      <section>
        <div class="container">
          <h2>${isEdit ? i18n.t('editEmployee') : i18n.t('addEmployee')}</h2>
          <form @submit=${this._submit}>
            <div class="row">
              <form-field label=${i18n.t('name')} type="text" .value=${this.employee.firstName} @input=${e=>this._updateField('firstName', e)} required></form-field>
              <form-field label=${i18n.t('lastName')} type="text" .value=${this.employee.lastName} @input=${e=>this._updateField('lastName', e)} required></form-field>
              <form-field label=${i18n.t('startDate')} type="date" .value=${this.employee.startDate} @input=${e=>this._updateField('startDate', e)} required></form-field>
            </div>
  
            <div class="row">
              <form-field label=${i18n.t('birthDate')} type="date" .value=${this.employee.birthDate} @input=${e=>this._updateField('birthDate', e)} required></form-field>
              <form-field label=${i18n.t('phone')} type="tel" .value=${this.employee.phone} @input=${e=>this._updateField('phone', e)} required></form-field>
              <form-field label=${i18n.t('email')} type="email" .value=${this.employee.email} @input=${e=>this._updateField('email', e)} required></form-field>
            </div>
  
            <div class="row">
              <form-field label=${i18n.t('department')} type="text" .value=${this.employee.department} @input=${e=>this._updateField('department', e)} required></form-field>
              <form-field label=${i18n.t('position')} type="select" .value=${this.employee.position} .options=${this.positions} @input=${e=>this._updateField('position', e)} required></form-field>
            </div>
  
            <div class="actions">
              <button class="save-button" type="submit">${i18n.t('save')}</button>
              <button class="cancel-button" type="button" @click=${this._cancel}>${i18n.t('cancel')}</button>
            </div>
          </form>
        </div>
      </section>
    `;
  }
  
}

customElements.define('add-edit-employee', AddEditEmployee);
