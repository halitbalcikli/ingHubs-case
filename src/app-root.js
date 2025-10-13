import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import { i18n } from './i18n/i18n.js';
import './components/header-component.js';
import './pages/employee-list.js';
import './pages/add-edit-employee.js';

export class AppRoot extends LitElement {
  static styles = css`
    main {
      padding: 0;
    }
  `;

  async connectedCallback() {
    super.connectedCallback();
    
    await i18n.load(i18n.lang);
  }

  firstUpdated() {
    const outlet = this.renderRoot.querySelector('#outlet');
    const router = new Router(outlet);
    router.setRoutes([
      { path: '/', component: 'employee-list' },
      { path: '/add-edit-employee', component: 'add-edit-employee' },
      { path: '/add-edit-employee/:id', component: 'add-edit-employee' },
      { path: '(.*)', redirect: '/' }
    ]);
  }

  render() {
    return html`
      <header-component></header-component>
      <div id="outlet"></div>
    `;
  }
}

customElements.define('app-root', AppRoot);
