import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { formatCurrency } from '../utils/helpers';

const AccountCard = ({ account, onEdit, onDelete }) => {
  const getRelatedBillsCount = () => {
    // This will be passed from parent
    return 0;
  };

  const getTypeIcon = (type) => {
    const icons = {
      checking: '💳',
      savings: '🏦',
      credit: '💳',
      other: '📁',
    };
    return icons[type] || '📁';
  };

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className="text-3xl">{getTypeIcon(account.type)}</span>
          <div>
            <h3 className="font-semibold text-gray-900">{account.name}</h3>
            <p className="text-sm text-gray-500 capitalize">{account.type}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(account.balance)}</p>
        </div>
      </div>
      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={() => onEdit(account)}
          className="btn btn-secondary text-sm flex-1"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(account.id)}
          className="btn btn-danger text-sm flex-1"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const AccountForm = ({ account, onClose }) => {
  const { addAccount, updateAccount } = useApp();
  const [formData, setFormData] = useState({
    name: account?.name || '',
    type: account?.type || 'checking',
    balance: account?.balance || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const accountData = {
      name: formData.name,
      type: formData.type,
      balance: parseFloat(formData.balance) || 0,
    };

    if (account) {
      updateAccount(account.id, accountData);
    } else {
      addAccount(accountData);
    }

    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {account ? 'Edit Account' : 'Add Account'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Account Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Chase Checking, Savings, Visa"
                className="input"
              />
            </div>

            {/* Account Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="input"
              >
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
                <option value="credit">Credit Card</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Balance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Balance *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  name="balance"
                  value={formData.balance}
                  onChange={handleChange}
                  required
                  step="0.01"
                  placeholder="0.00"
                  className="input pl-7"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary flex-1"
              >
                {account ? 'Save Changes' : 'Add Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const AccountManager = () => {
  const { accounts, deleteAccount, bills } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

  const handleEdit = (account) => {
    setEditingAccount(account);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    const relatedBills = bills.filter(b => b.accountId === id);
    let message = 'Are you sure you want to delete this account?';
    if (relatedBills.length > 0) {
      message += ` ${relatedBills.length} linked bill${relatedBills.length > 1 ? 's will' : ' will'} be unlinked.`;
    }

    if (confirm(message)) {
      deleteAccount(id);
    }
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Accounts</h1>
          <p className="text-gray-500 mt-1">
            {accounts.length} account{accounts.length !== 1 ? 's' : ''}, total balance {formatCurrency(totalBalance)}
          </p>
        </div>
        <button
          onClick={() => {
            setEditingAccount(null);
            setShowForm(true);
          }}
          className="btn btn-primary"
        >
          + Add Account
        </button>
      </div>

      {/* Summary Card */}
      <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <h2 className="text-lg font-semibold mb-2">Total Balance Across All Accounts</h2>
        <p className="text-4xl font-bold">{formatCurrency(totalBalance)}</p>
        <p className="text-primary-100 mt-2">
          {accounts.length} account{accounts.length !== 1 ? 's' : ''} tracked
        </p>
      </div>

      {/* Accounts List */}
      {accounts.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg">No accounts yet</p>
          <p className="text-gray-400 mt-2">Add your first account to start tracking balances!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.map(account => (
            <AccountCard
              key={account.id}
              account={account}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Account Form Modal */}
      {showForm && (
        <AccountForm
          account={editingAccount}
          onClose={() => {
            setShowForm(false);
            setEditingAccount(null);
          }}
        />
      )}
    </div>
  );
};

export default AccountManager;
