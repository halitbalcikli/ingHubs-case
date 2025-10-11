import { LitElement, html, css } from 'lit';
import '../components/form-field.js';
import { store, addEmployee } from '../store.js';

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
      department: ''  ,
    };
    this.positions = ['Junior', 'Mid', 'Senior'];
  }

  _submit(e) {
    e.preventDefault();
    
    // Tüm form alanlarını validate et
    const formFields = this.shadowRoot.querySelectorAll('form-field');
    let isValid = true;
    
    formFields.forEach(field => {
      if (!field.validate()) {
        isValid = false;
      }
    });

    if (!isValid) {
      alert('Lütfen tüm zorunlu alanları doğru şekilde doldurunuz!');
      return;
    }

    store.dispatch(addEmployee(this.employee));
    alert('Çalışan başarıyla eklendi!');

    this.employee = { firstName:'', lastName:'', startDate:'', birthDate:'', phone:'', email:'', department:'', position:'' };
    this.requestUpdate();
  }

  _updateField(key, e) {
    this.employee[key] = e.target.value;
    this.requestUpdate();
  }

  render() {
    return html`
      <h2>Çalışan Ekle</h2>
      <form @submit=${this._submit}>
        <div class="form-grid">
          <div class="row">
            <form-field 
              label="Adı" 
              type="text" 
              .value=${this.employee.firstName} 
              @input=${e=>this._updateField('firstName', e)}
              required
              minLength=${2}
              errorMessage="Adı en az 2 karakter olmalıdır">
            </form-field>
            <form-field 
              label="Soyadı" 
              type="text" 
              .value=${this.employee.lastName} 
              @input=${e=>this._updateField('lastName', e)}
              required
              maxLength=${20}
              errorMessage="Soyadı en fazle 20 karakter olmalıdır">
            </form-field>
            <form-field 
              label="İşe Giriş Tarihi" 
              type="date" 
              .value=${this.employee.startDate} 
              @input=${e=>this._updateField('startDate', e)}
              required>
            </form-field>
          </div>
          <div class="row">
            <form-field 
              label="Doğum Tarihi" 
              type="date" 
              .value=${this.employee.birthDate} 
              @input=${e=>this._updateField('birthDate', e)}
              required>
            </form-field>
            <form-field 
              label="Telefon" 
              type="tel" 
              .value=${this.employee.phone} 
              @input=${e=>this._updateField('phone', e)}
              required
              minLength=${10}
              errorMessage="Geçerli bir telefon numarası giriniz (en az 10 karakter)">
            </form-field>
            <form-field 
              label="Email" 
              type="email" 
              .value=${this.employee.email} 
              @input=${e=>this._updateField('email', e)}
              required>
            </form-field>
          </div>
          <div class="row">
            <form-field 
              label="Departman" 
              type="text" 
              .value=${this.employee.department} 
              @input=${e=>this._updateField('department', e)}
              required
              minLength=${2}
              errorMessage="Departman en az 2 karakter olmalıdır">
            </form-field>
            <form-field 
              label="Pozisyon" 
              type="select" 
              .value=${this.employee.position} 
              .options=${this.positions} 
              @input=${e=>this._updateField('position', e)}
              required>
            </form-field>
          </div>
        </div>
        <button type="submit">Çalışan Ekle</button>
      </form>
    `;
  }
}

customElements.define('add-edit-employee', AddEditEmployee);
