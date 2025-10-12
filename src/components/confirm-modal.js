import { LitElement, html, css } from 'lit';

export class ConfirmModal extends LitElement {
  static properties = {
    open: { type: Boolean },
    message: { type: String },
  };

  static styles = css`
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .modal {
      background: white;
      border-radius: 12px;
      width: 360px;
      max-width: 90%;
      padding: 24px;
      text-align: center;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
      animation: fadeIn 0.2s ease-in-out;
    }
    h3 {
      margin: 0 0 16px;
      font-size: 18px;
      color: #333;
    }
    .buttons {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-top: 20px;
    }
    button {
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: 0.2s ease;
    }
    .cancel {
      background: #eee;
    }
    .cancel:hover {
      background: #ddd;
    }
    .confirm {
      background: #ff6600;
      color: white;
    }
    .confirm:hover {
      background: #e55a00;
    }
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `;
  
  constructor() {
    super();
    this.open = false;
    this.message = '';
  }

  close() {
    this.open = false;
    this.dispatchEvent(new CustomEvent('cancel'));
  }

  confirm() {
    this.open = false;
    this.dispatchEvent(new CustomEvent('confirm'));
  }

  render() {
    if (!this.open) return null;

    return html`
      <div class="overlay">
        <div class="modal">
          <h3>${this.message}</h3>
          <div class="buttons">
            <button class="cancel" @click=${this.close}>İptal</button>
            <button class="confirm" @click=${this.confirm}>Evet, Sil</button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('confirm-modal', ConfirmModal);
