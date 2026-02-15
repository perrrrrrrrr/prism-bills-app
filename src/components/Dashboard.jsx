import React from 'react';
import { formatCurrency, getOverdueBills, getBillsForWeek, getTotalUpcoming } from '../utils/helpers';
import { useApp } from '../contexts/AppContext';

const StatCard = ({ title, value, subtitle, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    red: 'bg-red-50 border-red-200',
    purple: 'bg-purple-50 border-purple-200',
  };

  return (
    <div className={`card ${colorClasses[color]}`}>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
};

const BillSummaryItem = ({ bill }) => {
  const { markBillPaid } = useApp();
  const urgency = bill.paid ? 'paid' :
                  new Date(bill.dueDate) < new Date() ? 'overdue' :
                  'upcoming';

  const colorClasses = {
    paid: 'bg-green-50 border-green-200',
    overdue: 'bg-red-50 border-red-200',
    upcoming: 'bg-blue-50 border-blue-200',
  };

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border ${colorClasses[urgency]} mb-2`}>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={bill.paid}
            onChange={(e) => markBillPaid(bill.id, e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className={`font-medium ${bill.paid ? 'line-through text-gray-400' : 'text-gray-900'}`}>
            {bill.name}
          </span>
        </div>
        <p className="text-sm text-gray-500 ml-6">
          Due: {new Date(bill.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-gray-900">{formatCurrency(bill.amount)}</p>
        {bill.accountId && (
          <p className="text-xs text-gray-500">
            {bill.accountName || 'Account'}
          </p>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { bills, accounts } = useApp();

  const overdueBills = getOverdueBills(bills);
  const weekBills = getBillsForWeek(bills);
  const totalUpcoming = getTotalUpcoming(bills);

  const totalAccountBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome to Prism Bills</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Due This Week"
          value={weekBills.length}
          subtitle={`${weekBills.length} bill${weekBills.length !== 1 ? 's' : ''}`}
          color="blue"
        />
        <StatCard
          title="Total Upcoming"
          value={formatCurrency(totalUpcoming)}
          subtitle="This month"
          color="green"
        />
        <StatCard
          title="Overdue"
          value={overdueBills.length}
          subtitle={overdueBills.length > 0 ? 'Needs attention' : 'All caught up'}
          color={overdueBills.length > 0 ? 'red' : 'green'}
        />
        <StatCard
          title="Account Balance"
          value={formatCurrency(totalAccountBalance)}
          subtitle={`${accounts.length} account${accounts.length !== 1 ? 's' : ''}`}
          color="purple"
        />
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => window.setLocation('bills')}
            className="btn btn-primary text-center"
          >
            + Add Bill
          </button>
          <button
            onClick={() => window.setLocation('accounts')}
            className="btn btn-secondary text-center"
          >
            + Add Account
          </button>
          <button
            onClick={() => window.setLocation('calendar')}
            className="btn btn-secondary text-center"
          >
            View Calendar
          </button>
          <button
            onClick={() => window.setLocation('bills')}
            className="btn btn-secondary text-center"
          >
            All Bills
          </button>
        </div>
      </div>

      {/* Due This Week */}
      {weekBills.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Due This Week</h2>
          <div className="max-h-64 overflow-y-auto">
            {weekBills.slice(0, 5).map(bill => (
              <BillSummaryItem key={bill.id} bill={bill} />
            ))}
            {weekBills.length > 5 && (
              <p className="text-sm text-gray-500 mt-2">
                + {weekBills.length - 5} more due this week
              </p>
            )}
          </div>
        </div>
      )}

      {/* Overdue Bills */}
      {overdueBills.length > 0 && (
        <div className="card border-red-200 bg-red-50">
          <h2 className="text-lg font-semibold text-red-800 mb-4">⚠️ Overdue Bills</h2>
          <div className="max-h-64 overflow-y-auto">
            {overdueBills.slice(0, 5).map(bill => (
              <BillSummaryItem key={bill.id} bill={bill} />
            ))}
            {overdueBills.length > 5 && (
              <p className="text-sm text-gray-600 mt-2">
                + {overdueBills.length - 5} more overdue
              </p>
            )}
          </div>
        </div>
      )}

      {/* Accounts Overview */}
      {accounts.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Accounts</h2>
          <div className="space-y-2">
            {accounts.map(account => (
              <div key={account.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{account.name}</p>
                  <p className="text-sm text-gray-500 capitalize">{account.type}</p>
                </div>
                <p className="text-lg font-semibold">{formatCurrency(account.balance)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
