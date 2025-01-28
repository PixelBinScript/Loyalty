import type { Customer } from '../types';

class LoyaltyWidget {
  private container: HTMLElement;
  private isOpen = false;
  private customer: Customer | null = null;

  constructor() {
    this.container = document.createElement('div');
    this.container.id = 'loyalty-widget';
    document.body.appendChild(this.container);
    this.init();
  }

  private async init() {
    try {
      // Obtener cliente actual
      const response = await fetch('/loyalty/customer', {
        credentials: 'include'
      });
      this.customer = await response.json();
      this.render();
    } catch (error) {
      console.error('Error initializing loyalty widget:', error);
    }
  }

  private render() {
    if (!this.customer) return;

    const widgetButton = document.createElement('button');
    widgetButton.className = 'loyalty-widget-button';
    widgetButton.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
        <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
        <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
      </svg>
    `;

    widgetButton.addEventListener('click', () => this.toggle());

    const widgetPanel = document.createElement('div');
    widgetPanel.className = 'loyalty-widget-panel';
    widgetPanel.style.display = this.isOpen ? 'block' : 'none';
    widgetPanel.innerHTML = `
      <div class="loyalty-widget-header">
        <h3>Tus Puntos</h3>
        <button class="loyalty-widget-close">&times;</button>
      </div>
      <div class="loyalty-widget-content">
        <div class="loyalty-widget-points">
          <span class="loyalty-widget-points-value">${this.customer.points}</span>
          <span class="loyalty-widget-points-label">puntos</span>
        </div>
        <div class="loyalty-widget-tier">
          <span class="loyalty-widget-tier-label">Nivel</span>
          <span class="loyalty-widget-tier-value">${this.customer.tier}</span>
        </div>
      </div>
    `;

    this.container.innerHTML = '';
    this.container.appendChild(widgetButton);
    this.container.appendChild(widgetPanel);

    // Agregar estilos
    const styles = document.createElement('style');
    styles.textContent = this.getStyles();
    document.head.appendChild(styles);
  }

  private toggle() {
    this.isOpen = !this.isOpen;
    const panel = this.container.querySelector('.loyalty-widget-panel');
    if (panel) {
      panel.style.display = this.isOpen ? 'block' : 'none';
    }
  }

  private getStyles() {
    return `
      .loyalty-widget-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 25px;
        background: #9333EA;
        color: white;
        border: none;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      }

      .loyalty-widget-panel {
        position: fixed;
        bottom: 80px;
        right: 20px;
        width: 300px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 9999;
      }

      .loyalty-widget-header {
        padding: 16px;
        border-bottom: 1px solid #e5e7eb;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .loyalty-widget-header h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
      }

      .loyalty-widget-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #6b7280;
      }

      .loyalty-widget-content {
        padding: 16px;
      }

      .loyalty-widget-points {
        text-align: center;
        margin-bottom: 16px;
      }

      .loyalty-widget-points-value {
        font-size: 36px;
        font-weight: 700;
        color: #9333EA;
      }

      .loyalty-widget-points-label {
        font-size: 14px;
        color: #6b7280;
      }

      .loyalty-widget-tier {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        background: #f3f4f6;
        border-radius: 8px;
      }

      .loyalty-widget-tier-label {
        font-size: 14px;
        color: #6b7280;
      }

      .loyalty-widget-tier-value {
        font-weight: 600;
        color: #9333EA;
      }
    `;
  }
}

// Inicializar widget
window.addEventListener('load', () => {
  new LoyaltyWidget();
});