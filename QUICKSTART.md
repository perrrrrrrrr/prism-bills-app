# Prism Bills - Quick Start Guide

## 5-Minute Setup

### 1. Install & Run
```bash
cd ~/prism-bills-app
npm install
npm run dev
```

### 2. Open Browser
Navigate to: `http://localhost:5173`

### 3. Allow Notifications
When prompted, click "Allow" to enable bill reminders.

### 4. Add Your First Bill
1. Click the "+ Add Bill" button
2. Fill in:
   - Name: e.g., "Rent"
   - Amount: e.g., 1500
   - Due Date: Pick a date
   - Category: Select from dropdown
3. Click "Add Bill"

### 5. Explore the App
- **Dashboard**: See your bills at a glance
- **Bills Tab**: View all bills with filters
- **Calendar**: Monthly view of due dates
- **Accounts**: Track your account balances

## Keyboard Shortcuts (Coming Soon)

## Tips

1. **Start Simple**: Add 3-5 key bills first
2. **Use Categories**: Helps organize and filter
3. **Enable Notifications**: Never miss a due date
4. **Link Accounts**: Optional but helps track spending
5. **Set Recurring**: For monthly/weekly bills

## Need Sample Data?

Open the browser console (F12) and paste the code from `SAMPLE_DATA.md` to populate the app with example bills and accounts.

## Stopping the App

Press `Ctrl+C` in the terminal to stop the dev server.

## Building for Production

```bash
npm run build
```

Built files are in the `dist/` directory.

---

**Questions?** Check the full README.md for detailed documentation.
