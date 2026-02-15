import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'prism-bills-data';

const DEFAULT_DATA = {
  bills: [],
  accounts: [],
  settings: {
    notificationsEnabled: true,
    reminderDays: [1, 3, 7], // days before due date
  },
};

export const storage = {
  getData() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        return DEFAULT_DATA;
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading from storage:', error);
      return DEFAULT_DATA;
    }
  },

  saveData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  },

  // Bills
  getBills() {
    return this.getData().bills;
  },

  addBill(bill) {
    const data = this.getData();
    const newBill = {
      id: uuidv4(),
      ...bill,
      paid: false,
      paidDate: null,
      createdAt: new Date().toISOString(),
    };
    data.bills.push(newBill);
    this.saveData(data);
    return newBill;
  },

  updateBill(id, updates) {
    const data = this.getData();
    const billIndex = data.bills.findIndex(b => b.id === id);
    if (billIndex === -1) return null;

    data.bills[billIndex] = { ...data.bills[billIndex], ...updates };
    this.saveData(data);
    return data.bills[billIndex];
  },

  deleteBill(id) {
    const data = this.getData();
    data.bills = data.bills.filter(b => b.id !== id);
    this.saveData(data);
  },

  markBillPaid(id, paid = true) {
    return this.updateBill(id, {
      paid,
      paidDate: paid ? new Date().toISOString() : null,
    });
  },

  // Accounts
  getAccounts() {
    return this.getData().accounts;
  },

  addAccount(account) {
    const data = this.getData();
    const newAccount = {
      id: uuidv4(),
      ...account,
      createdAt: new Date().toISOString(),
    };
    data.accounts.push(newAccount);
    this.saveData(data);
    return newAccount;
  },

  updateAccount(id, updates) {
    const data = this.getData();
    const accountIndex = data.accounts.findIndex(a => a.id === id);
    if (accountIndex === -1) return null;

    data.accounts[accountIndex] = { ...data.accounts[accountIndex], ...updates };
    this.saveData(data);
    return data.accounts[accountIndex];
  },

  deleteAccount(id) {
    const data = this.getData();
    data.accounts = data.accounts.filter(a => a.id !== id);
    // Unlink bills from deleted account
    data.bills = data.bills.map(b =>
      b.accountId === id ? { ...b, accountId: null } : b
    );
    this.saveData(data);
  },

  // Settings
  getSettings() {
    return this.getData().settings;
  },

  updateSettings(updates) {
    const data = this.getData();
    data.settings = { ...data.settings, ...updates };
    this.saveData(data);
    return data.settings;
  },
};
