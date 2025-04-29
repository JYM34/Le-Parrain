export class HUD {
    constructor() {
      this.nameEl = document.getElementById('player-name');
      this.moneyEl = document.getElementById('player-money');
      this.resourcesEl = document.getElementById('player-resources');
      this.reputationEl = document.getElementById('player-reputation');
  
      // Créer le conteneur de notifications
      this.notificationContainer = document.createElement('div');
      this.notificationContainer.id = 'hud-notifications';
      document.body.appendChild(this.notificationContainer);
    }
  
    update(player) {
      this.nameEl.innerHTML = `<span class="don-name">👑 Don ${player.username}</span>`;
      this.moneyEl.textContent = player.money;
      this.resourcesEl.textContent = player.resources;
      this.reputationEl.textContent = player.reputation;
    }
  
    notify(text) {
      const notif = document.createElement('div');
      notif.className = 'hud-notification';
      notif.textContent = text;
      this.notificationContainer.appendChild(notif);
  
      setTimeout(() => {
        notif.classList.add('fade-out');
        notif.addEventListener('transitionend', () => notif.remove());
      }, 2000);
    }
  }
  