export const notifications = {
  async requestPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  },

  checkPermission() {
    if ('Notification' in window) {
      return Notification.permission === 'granted';
    }
    return false;
  },

  show(title, options = {}) {
    if (this.checkPermission()) {
      return new Notification(title, {
        icon: '/bill-icon.png',
        badge: '/bill-icon.png',
        ...options,
      });
    }
  },

  // Check for upcoming and overdue bills
  checkBills(bills) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    bills.forEach(bill => {
      if (bill.paid) return;

      const dueDate = new Date(bill.dueDate);
      const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

      // Overdue
      if (daysUntilDue < 0) {
        this.show(`Overdue: ${bill.name}`, {
          body: `${bill.name} was due ${Math.abs(daysUntilDue)} days ago. Amount: $${bill.amount}`,
          tag: bill.id,
          requireInteraction: true,
        });
      }
      // Due today
      else if (daysUntilDue === 0) {
        this.show(`Due Today: ${bill.name}`, {
          body: `Amount: $${bill.amount}`,
          tag: bill.id,
        });
      }
      // Due soon (1 day, 3 days, 1 week)
      else if ([1, 3, 7].includes(daysUntilDue)) {
        this.show(`Upcoming Bill: ${bill.name}`, {
          body: `Due in ${daysUntilDue} day${daysUntilDue > 1 ? 's' : ''}. Amount: $${bill.amount}`,
          tag: bill.id,
        });
      }
    });
  },
};

// Initialize notifications on app load
export async function initNotifications() {
  const hasPermission = await notifications.requestPermission();
  return hasPermission;
}
