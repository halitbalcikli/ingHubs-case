import { LitElement, html, css } from 'lit';
import { i18n } from '../i18n/i18n.js';

export class HeaderComponent extends LitElement {
  static styles = css`
    header {
      background: #007bff;
      color: white;
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    nav a {
      color: white;
      text-decoration: none;
      margin: 0 8px;
      font-weight: 500;
    }
    nav a:hover {
      text-decoration: underline;
    }
    .lang-switch {
      background: white;
      color: #007bff;
      border: none;
      border-radius: 6px;
      padding: 4px 8px;
      cursor: pointer;
      font-weight: bold;
    }
  `;

  constructor() {
    super();
    this.lang = i18n.lang;
    window.addEventListener('lang-changed', (e) => {
      this.lang = e.detail.lang;
      this.requestUpdate();
    });
  }

  switchLang() {
    const newLang = this.lang === 'tr' ? 'en' : 'tr';
    i18n.setLang(newLang);
  }

  render() {
    return html`
      <header>
        <div><strong>${i18n.t('appTitle')}</strong></div>
        <nav>
          <a href="/">${i18n.t('employees')}</a>
          <a href="/add-edit-employee">${i18n.t('addEditEmployee')}</a>
        </nav>
        <button class="lang-switch" @click=${this.switchLang}>
          ${this.lang === 'tr' ? '🇹🇷 TR' : '🇬🇧 EN'}
        </button>
      </header>
    `;
  }
}

customElements.define('header-component', HeaderComponent);
