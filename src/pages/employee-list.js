import { LitElement, html, css } from 'lit';
import { store } from '../store.js';

export class EmployeeList extends LitElement {
  static styles = css`section { padding: 1rem; } table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ccc; padding: 0.5rem; text-align: left; }`;

  constructor() {
    super();
    this.employees = store.getState().employees;

    // Redux subscribe ile reactive güncelleme
    store.subscribe(() => {
      this.employees = store.getState().employees;
      this.requestUpdate();
    });
  }

  render() {
    return html`
      <section>
        <h2>Employee List</h2>
        <table>
          <thead>
            <tr>
              <th>Adı</th>
              <th>Soyadı</th>
              <th>İşe Giriş</th>
              <th>Doğum</th>
              <th>Telefon</th>
              <th>Email</th>
              <th>Departman</th>
              <th>Pozisyon</th>
            </tr>
          </thead>
          <tbody>
            ${this.employees.map(emp => html`
              <tr>
                <td>${emp.firstName}</td>
                <td>${emp.lastName}</td>
                <td>${emp.startDate}</td>
                <td>${emp.birthDate}</td>
                <td>${emp.phone}</td>
                <td>${emp.email}</td>
                <td>${emp.department}</td>
                <td>${emp.position}</td>
              </tr>
            `)}
          </tbody>
        </table>
      </section>
    `;
  }
}

customElements.define('employee-list', EmployeeList);
