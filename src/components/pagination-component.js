import { LitElement, html, css } from 'lit';

export class PaginationComponent extends LitElement {
  static styles = css`
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 20px 0;
      gap: 8px;
    }
    button {
      padding: 6px 12px;
      border: none;
      background: #f6f6f6;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }
    button:hover {
      background: #e0e0e0;
    }
    button.active {
      background: #FF6600;
      color: white;
    }
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `;

  static properties = {
    totalItems: { type: Number },
    itemsPerPage: { type: Number },
    currentPage: { type: Number },
  };

  constructor() {
    super();
    this.totalItems = 0;
    this.itemsPerPage = 5;
    this.currentPage = 1;
  }

  get totalPages() {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  handlePageChange(page) {
    if (page < 1 || page > this.totalPages) return;
    this.dispatchEvent(new CustomEvent('page-change', { detail: { page } }));
  }

  render() {
    const pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

    return html`
      <div class="pagination">
        <button ?disabled=${this.currentPage === 1} @click=${() => this.handlePageChange(this.currentPage - 1)}>⟨</button>
        ${pages.map(page => html`
          <button
            class=${page === this.currentPage ? 'active' : ''}
            @click=${() => this.handlePageChange(page)}
          >
            ${page}
          </button>
        `)}
        <button ?disabled=${this.currentPage === this.totalPages} @click=${() => this.handlePageChange(this.currentPage + 1)}>⟩</button>
      </div>
    `;
  }
}

customElements.define('pagination-component', PaginationComponent);
