# Prisma 💜

A modern bill tracking app inspired by Prism (the popular bill tracking app that shut down). Built with React + Vite, featuring local storage persistence and browser notifications.

## Features

### 📊 Dashboard
- Overview of upcoming bills, overdue bills, and account balances
- Quick stats for bills due this week and this month
- Quick actions to add bills and accounts
- Account balance overview

### 💳 Bill Management
- Add, edit, and delete bills
- Track bill name, amount, due date, category, and linked account
- Mark bills as paid with one click
- One-time and recurring bills (weekly, bi-weekly, monthly)
- Color-coded by urgency:
  - 🟢 Green - Upcoming (more than 7 days)
  - 🟡 Yellow - Due this week (3-7 days)
  - 🟠 Orange - Due soon (1-3 days)
  - 🔴 Red - Overdue

### 📅 Calendar View
- Monthly calendar showing all bill due dates
- Navigate between months
- See bill amounts and status at a glance
- Monthly summary of total due and paid bills

### 🏦 Account Management
- Track multiple accounts (checking, savings, credit cards)
- Monitor account balances
- Link bills to specific accounts
- View total balance across all accounts

### 🔔 Notifications
- Browser push notifications for upcoming bills
- Reminders 1 day, 3 days, and 1 week before due
- Overdue bill alerts
- Due today notifications

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Modern styling
- **date-fns** - Date manipulation and formatting
- **UUID** - Unique ID generation
- **Local Storage** - Data persistence

## Installation

1. **Clone or download the project**
   ```bash
   cd ~/prism-bills-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to the URL shown in the terminal (usually `http://localhost:5173`)

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Usage

### First Time Setup

1. **Add Accounts** (optional)
   - Go to the Accounts tab
   - Click "Add Account"
   - Enter account name, type, and balance

2. **Add Bills**
   - Click "+ Add Bill" from any view
   - Fill in bill details:
     - Name (e.g., "Rent", "Netflix")
     - Amount
     - Due date
     - Recurring frequency (optional)
     - Category
     - Linked account (optional)

3. **Enable Notifications**
   - Allow browser notifications when prompted
   - You'll receive reminders before bills are due

### Managing Bills

- **Mark as Paid**: Click the checkbox next to any bill
- **Edit**: Click "Edit" on a bill card
- **Delete**: Click "Delete" on a bill card
- **Filter & Sort**: Use the filters in the Bills view

### Calendar Navigation

- Use arrow buttons to navigate months
- Click "Today" to jump to the current month
- Hover over bill dots to see details

## Data Structure

Data is stored in `localStorage` under the key `prism-bills-data`:

```json
{
  "bills": [
    {
      "id": "uuid",
      "name": "Rent",
      "amount": 1500,
      "dueDate": "2025-02-01",
      "recurring": "monthly",
      "category": "Housing",
      "accountId": "account-uuid",
      "paid": false,
      "paidDate": null,
      "createdAt": "2025-01-15T10:00:00.000Z"
    }
  ],
  "accounts": [
    {
      "id": "uuid",
      "name": "Chase Checking",
      "type": "checking",
      "balance": 5000,
      "createdAt": "2025-01-15T10:00:00.000Z"
    }
  ],
  "settings": {
    "notificationsEnabled": true,
    "reminderDays": [1, 3, 7]
  }
}
```

## Privacy & Data

- **All data is stored locally** in your browser's localStorage
- No data is sent to any server
- No tracking or analytics
- Export your data by copying from browser DevTools → Application → Local Storage

## Browser Support

- Chrome/Edge (recommended for full notification support)
- Firefox
- Safari
- Any modern browser with localStorage support

## Tips & Tricks

1. **Recurring Bills**: Set up recurring bills once and they'll automatically appear each period
2. **Account Linking**: Link bills to accounts to track spending from specific accounts
3. **Categories**: Use categories to organize bills (Housing, Utilities, Subscriptions, etc.)
4. **Quick Mark Paid**: Use the checkbox on dashboard and list views for fast payment tracking
5. **Calendar View**: See your entire month at a glance to plan cash flow

## Project Structure

```
prism-bills-app/
├── src/
│   ├── components/
│   │   ├── AccountManager.jsx  # Account CRUD operations
│   │   ├── BillForm.jsx        # Add/edit bill form
│   │   ├── BillList.jsx        # Bills list with filters
│   │   ├── CalendarView.jsx    # Monthly calendar
│   │   ├── Dashboard.jsx       # Main dashboard
│   │   └── Navigation.jsx      # App navigation
│   ├── contexts/
│   │   └── AppContext.jsx      # Global state management
│   ├── utils/
│   │   ├── helpers.js          # Helper functions
│   │   ├── notifications.js    # Browser notifications
│   │   └── storage.js          # LocalStorage wrapper
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # Entry point
│   └── index.css               # Tailwind + custom styles
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## Credits

This is a tribute to **Prism**, the beautiful bill tracking app that sadly shut down. We built this to keep the spirit of simple, elegant bill tracking alive.

Made with 💜 using React + Vite + Tailwind CSS

---

**Note**: This is a local-only application. Your data stays on your device. Make sure to back up your localStorage data periodically if you want to keep your bills safe!
