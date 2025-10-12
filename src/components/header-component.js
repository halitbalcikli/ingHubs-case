import { LitElement, html, css } from 'lit';
import { i18n } from '../i18n/i18n.js';

import ingLogo from '../assets/ing-logo.png';

export class HeaderComponent extends LitElement {
  static styles = css`
    header {
      background: #fff;
      color: white;
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    nav a {
      color: #FF6600;
      text-decoration: none;
      margin: 0 8px;
      font-weight: 500;
    }
    nav a:hover {
      text-decoration: underline;
    },
    .header-logo {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 10px;
    }
    .header-logo img {
      width: 40px;
      height: 40px;
      display: inline-block;
      vertical-align: middle;
    }
    .header-logo-text {
      color: #000;
      font-size: 16px;
      display: inline-flex;
      align-items: center;
      height: 40px;
      margin-left: 0;
    }
    .lang-switch {
      background: white;
      color: #007bff;
      border: none;
      border-radius: 6px;
      padding: 4px 8px;
      cursor: pointer;
      font-weight: bold;
    },
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
      <header style="display: flex; align-items: center; justify-content: space-between;">
        <div class="header-logo">
          <img src="${ingLogo}" alt="ING Logo">
          <strong class="header-logo-text">ING</strong>
        </div>
        <div style="display: flex; align-items: center; gap: 16px; margin-left: auto;">
          <nav class="header-nav">
            <a class="nav-link" href="/">${i18n.t('employees')}</a>
            <a class="nav-link" href="/add-edit-employee">${i18n.t('addNew')}</a>
          </nav>
          <button class="lang-switch" @click=${this.switchLang}>
            ${this.lang === 'tr' ? '🇹🇷' : '🇬🇧'}
          </button>
        </div>
      </header>
    `;
  }
}

customElements.define('header-component', HeaderComponent);
