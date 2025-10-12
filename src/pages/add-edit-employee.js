import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import '../components/form-field.js';
import { store, addEmployee, updateEmployee } from '../store.js';

export class AddEditEmployee extends LitElement {
  static styles = css`
    .form-grid { display: flex; flex-wrap: wrap; gap: 1rem; }
    .row { display: flex; flex: 1 1 100%; gap: 1rem; }
    button { margin-top: 1rem; padding: 0.5rem 1rem; }
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

  render() {
    const isEdit = this.editIndex !== null;
    return html`
      <h2>${isEdit ? 'Çalışanı Düzenle' : 'Çalışan Ekle'}</h2>
      <form @submit=${this._submit}>
        <div class="form-grid">
          <div class="row">
            <form-field label="Adı" type="text" .value=${this.employee.firstName} @input=${e=>this._updateField('firstName', e)} required></form-field>
            <form-field label="Soyadı" type="text" .value=${this.employee.lastName} @input=${e=>this._updateField('lastName', e)} required></form-field>
            <form-field label="İşe Giriş Tarihi" type="date" .value=${this.employee.startDate} @input=${e=>this._updateField('startDate', e)} required></form-field>
          </div>
          <div class="row">
            <form-field label="Doğum Tarihi" type="date" .value=${this.employee.birthDate} @input=${e=>this._updateField('birthDate', e)} required></form-field>
            <form-field label="Telefon" type="tel" .value=${this.employee.phone} @input=${e=>this._updateField('phone', e)} required></form-field>
            <form-field label="Email" type="email" .value=${this.employee.email} @input=${e=>this._updateField('email', e)} required></form-field>
          </div>
          <div class="row">
            <form-field label="Departman" type="text" .value=${this.employee.department} @input=${e=>this._updateField('department', e)} required></form-field>
            <form-field label="Pozisyon" type="select" .value=${this.employee.position} .options=${this.positions} @input=${e=>this._updateField('position', e)} required></form-field>
          </div>
        </div>
        <button type="submit">${isEdit ? 'Güncelle' : 'Ekle'}</button>
      </form>
    `;
  }
}

customElements.define('add-edit-employee', AddEditEmployee);
