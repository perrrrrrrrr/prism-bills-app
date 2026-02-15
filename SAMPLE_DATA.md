# Sample Data for Testing

If you want to quickly test the app with sample data, open your browser's DevTools (F12), go to the Console tab, and paste this:

```javascript
// Sample Accounts
const sampleAccounts = [
  { name: "Chase Checking", type: "checking", balance: 5420.50 },
  { name: "Bank of America Savings", type: "savings", balance: 15000.00 },
  { name: "Chase Sapphire Reserve", type: "credit", balance: -2340.75 },
];

// Sample Bills
const sampleBills = [
  {
    name: "Rent",
    amount: 1800,
    dueDate: "2025-02-01",
    recurring: "monthly",
    category: "Housing",
    accountId: null
  },
  {
    name: "Electric Bill",
    amount: 145.50,
    dueDate: getRelativeDate(2),
    recurring: "monthly",
    category: "Utilities",
    accountId: null
  },
  {
    name: "Internet",
    amount: 79.99,
    dueDate: getRelativeDate(5),
    recurring: "monthly",
    category: "Utilities",
    accountId: null
  },
  {
    name: "Netflix",
    amount: 15.99,
    dueDate: getRelativeDate(7),
    recurring: "monthly",
    category: "Subscriptions",
    accountId: null
  },
  {
    name: "Car Insurance",
    amount: 185.00,
    dueDate: getRelativeDate(-3),
    recurring: "monthly",
    category: "Insurance",
    accountId: null
  },
  {
    name: "Phone Bill",
    amount: 85.00,
    dueDate: getRelativeDate(10),
    recurring: "monthly",
    category: "Utilities",
    accountId: null
  },
  {
    name: "Gym Membership",
    amount: 49.99,
    dueDate: getRelativeDate(14),
    recurring: "monthly",
    category: "Subscriptions",
    accountId: null
  },
  {
    name: "Car Payment",
    amount: 450.00,
    dueDate: getRelativeDate(15),
    recurring: "monthly",
    category: "Transportation",
    accountId: null
  },
  {
    name: "Health Insurance",
    amount: 320.00,
    dueDate: getRelativeDate(20),
    recurring: "monthly",
    category: "Insurance",
    accountId: null
  },
  {
    name: "Groceries",
    amount: 600.00,
    dueDate: getRelativeDate(25),
    recurring: "monthly",
    category: "Food",
    accountId: null
  },
];

function getRelativeDate(daysFromNow) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
}

// Load sample data
const { v4: uuidv4 } = window.uuid || { v4: () => Math.random().toString(36).substr(2, 9) };

const accountsWithIds = sampleAccounts.map(acc => ({
  ...acc,
  id: uuidv4(),
  createdAt: new Date().toISOString()
}));

const billsWithIds = sampleBills.map(bill => ({
  ...bill,
  id: uuidv4(),
  paid: false,
  paidDate: null,
  createdAt: new Date().toISOString()
}));

const data = {
  bills: billsWithIds,
  accounts: accountsWithIds,
  settings: {
    notificationsEnabled: true,
    reminderDays: [1, 3, 7]
  }
};

// Save to localStorage
localStorage.setItem('prism-bills-data', JSON.stringify(data));

// Reload the page to see the data
location.reload();
```

This will create:
- 3 accounts (checking, savings, credit card)
- 10 sample bills with various due dates
- Some overdue, some due soon, some upcoming
- Mix of recurring bills across different categories

After pasting, the page will reload and you'll see all the sample data populated!
