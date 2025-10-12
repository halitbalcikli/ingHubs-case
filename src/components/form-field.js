import { LitElement, html, css } from 'lit';
import { i18n } from '../i18n/i18n.js';

export class FormField extends LitElement {
  static properties = {
    label: { type: String },
    value: { type: String },
    type: { type: String },
    options: { type: Array },
    required: { type: Boolean },
    pattern: { type: String },
    minLength: { type: Number },
    maxLength: { type: Number },
    errorMessage: { type: String },
    _error: { state: true }
  };

  constructor() {
    super();
    this._error = '';

    window.addEventListener('lang-changed', (e) => {
      this.lang = e.detail.lang;
      this.requestUpdate();
    });
  }

  static styles = css`
    .field {
      display: flex;
      flex-direction: column;
      margin: 0.5rem;
      flex: 1;
    }
    label {
      font-weight: bold;
      margin-bottom: 0.25rem;
    }
    label .required {
      color: red;
    }
    input, select {
      padding: 0.5rem;
      font-size: 1rem;
      border-radius: 4px;
      border: 1px solid #ccc;
      transition: border-color 0.3s;
    }
    input.invalid, select.invalid {
      border-color: #dc3545;
    }
    input.valid, select.valid {
      border-color: #28a745;
    }
    .error {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
      min-height: 1.25rem;
    }
  `;

  _validate(value) {
    if (this.required && (!value || value.trim() === '')) {
      return this.errorMessage || i18n.t('required');
    }

    if (!value || value.trim() === '') {
      return '';
    }

    if (this.minLength && value.length < this.minLength) {
      return this.errorMessage || `En az ${this.minLength} karakter olmalıdır`;
    }

    if (this.maxLength && value.length > this.maxLength) {
      return this.errorMessage || `En fazla ${this.maxLength} karakter olmalıdır`;
    }

    if (this.pattern) {
      const regex = new RegExp(this.pattern);
      if (!regex.test(value)) {
        return this.errorMessage || i18n.t('invalidFormat');
      }
    }

    if (this.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return this.errorMessage || i18n.t('invalidEmail');
      }
    }

    if (this.type === 'tel' && value) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(value)) {
        return this.errorMessage || i18n.t('invalidPhone');
      }
    }

    return '';
  }

  _handleInput(e) {
    const value = e.target.value;
    this._error = this._validate(value);
    
    // Validation durumunu parent component'e bildir
    this.dispatchEvent(new CustomEvent('validation', {
      detail: { 
        isValid: !this._error,
        value: value,
        field: this.label 
      },
      bubbles: true,
      composed: true
    }));

    // Original input eventini de ilet
    this.dispatchEvent(new CustomEvent('input', {
      detail: { value },
      bubbles: true,
      composed: true
    }));
  }

  _handleChange(e) {
    const value = e.target.value;
    this._error = this._validate(value);
    
    // Change eventi de gönder
    this.dispatchEvent(new CustomEvent('change', {
      detail: { 
        isValid: !this._error,
        value: value 
      },
      bubbles: true,
      composed: true
    }));
  }

  validate() {
    this._error = this._validate(this.value);
    return !this._error;
  }

  render() {
    const hasError = this._error !== '';
    const hasValue = this.value && this.value.trim() !== '';
    const cssClass = hasError ? 'invalid' : (hasValue ? 'valid' : '');

    return html`
      <div class="field">
        <label>
          ${this.label}
          ${this.required ? html`<span class="required">*</span>` : ''}
        </label>
        ${this.type === 'select'
          ? html`<select 
              class=${cssClass}
              .value=${this.value}
              @input=${this._handleInput}
              @change=${this._handleChange}
              ?required=${this.required}>
              <option value="">${i18n.t('pleaseSelect')}</option>
              ${this.options?.map(opt => html`<option value=${opt}>${opt}</option>`)}
            </select>`
          : html`<input 
              class=${cssClass}
              type=${this.type} 
              .value=${this.value}
              @input=${this._handleInput}
              @change=${this._handleChange}
              ?required=${this.required}
              minlength=${this.minLength || ''}
              maxlength=${this.maxLength || ''}
              pattern=${this.pattern || ''} />`}
        <div class="error">${this._error}</div>
      </div>
    `;
  }
}

customElements.define('form-field', FormField);
