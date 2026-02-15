import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';

const BillForm = ({ bill, onClose }) => {
  const { accounts, addBill, updateBill } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    dueDate: '',
    recurring: 'none',
    category: '',
    accountId: '',
  });

  useEffect(() => {
    if (bill) {
      setFormData({
        name: bill.name || '',
        amount: bill.amount || '',
        dueDate: bill.dueDate || '',
        recurring: bill.recurring || 'none',
        category: bill.category || '',
        accountId: bill.accountId || '',
      });
    }
  }, [bill]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const billData = {
      name: formData.name,
      amount: parseFloat(formData.amount),
      dueDate: formData.dueDate,
      recurring: formData.recurring,
      category: formData.category,
      accountId: formData.accountId || null,
    };

    if (bill) {
      updateBill(bill.id, billData);
    } else {
      addBill(billData);
    }

    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const categories = [
    'Housing',
    'Utilities',
    'Insurance',
    'Subscriptions',
    'Transportation',
    'Food',
    'Healthcare',
    'Entertainment',
    'Education',
    'Other',
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {bill ? 'Edit Bill' : 'Add Bill'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Bill Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bill Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Rent, Netflix, Electric"
                className="input"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="input pl-7"
                />
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date *
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
                className="input"
              />
            </div>

            {/* Recurring */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recurring
              </label>
              <select
                name="recurring"
                value={formData.recurring}
                onChange={handleChange}
                className="input"
              >
                <option value="none">One-time</option>
                <option value="weekly">Weekly</option>
                <option value="bi-weekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="input"
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Account */}
            {accounts.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account (Optional)
                </label>
                <select
                  name="accountId"
                  value={formData.accountId}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">No account</option>
                  {accounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.name} ({account.type})
                    </option>
                  ))}
                </select>
              </div>
            )}

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
                {bill ? 'Save Changes' : 'Add Bill'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BillForm;
