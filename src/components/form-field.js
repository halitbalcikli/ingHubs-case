import { LitElement, html, css } from 'lit';

export class FormField extends LitElement {
  static properties = {
    label: { type: String },
    value: { type: String },
    type: { type: String },
    options: { type: Array } 
  };

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
    input, select {
      padding: 0.5rem;
      font-size: 1rem;
      border-radius: 4px;
      border: 1px solid #ccc;
    }
  `;

  render() {
    return html`
      <div class="field">
        <label>${this.label}</label>
        ${this.type === 'select'
          ? html`<select .value=${this.value}>
              ${this.options?.map(opt => html`<option value=${opt}>${opt}</option>`)}
            </select>`
          : html`<input type=${this.type} .value=${this.value} />`}
      </div>
    `;
  }
}

customElements.define('form-field', FormField);
