export class Player {
    constructor({ username, ressources }) {
      this.username = username;
      this.name = username;  // alias
  
      this.cash = ressources.cash;
      this.influence = ressources.influence;
      this.soldiers = ressources.soldiers;
  
      // ✅ alias compatibles HUD
      this.money = this.cash;
      this.resources = this.influence;
      this.reputation = this.soldiers;
    }
  
    gainCash(amount) {
      this.cash += amount;
      this.money = this.cash; // sync alias
    }
  
    spendCash(amount) {
      if (this.cash >= amount) {
        this.cash -= amount;
        this.money = this.cash;
        return true;
      }
      return false;
    }
  
    gainInfluence(amount) {
      this.influence += amount;
      this.resources = this.influence;
    }
  
    recruitSoldiers(amount) {
      this.soldiers += amount;
      this.reputation = this.soldiers;
    }
  
    toJSON() {
      return {
        username: this.username,
        ressources: {
          cash: this.cash,
          influence: this.influence,
          soldiers: this.soldiers
        }
      };
    }
  }
  