import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { formatCurrency, formatDate, getUrgencyLevel, getUrgencyColor, getUrgencyLabel, getDaysUntilDue } from '../utils/helpers';
import BillForm from './BillForm';

const BillCard = ({ bill, onEdit, onDelete }) => {
  const { markBillPaid } = useApp();
  const urgency = getUrgencyLevel(bill);
  const urgencyColor = getUrgencyColor(urgency);
  const daysUntilDue = getDaysUntilDue(bill.dueDate);

  const getDaysText = () => {
    if (bill.paid) return 'Paid';
    if (daysUntilDue < 0) return `${Math.abs(daysUntilDue)} days overdue`;
    if (daysUntilDue === 0) return 'Due today';
    if (daysUntilDue === 1) return 'Due tomorrow';
    return `Due in ${daysUntilDue} days`;
  };

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <input
            type="checkbox"
            checked={bill.paid}
            onChange={(e) => markBillPaid(bill.id, e.target.checked)}
            className="w-5 h-5 mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className={`font-semibold ${bill.paid ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                {bill.name}
              </h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${urgencyColor}`}>
                {getUrgencyLabel(urgency)}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{getDaysText()}</p>
            <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-600">
              <span className="bg-gray-100 px-2 py-1 rounded">{bill.category}</span>
              {bill.recurring && bill.recurring !== 'none' && (
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded capitalize">
                  {bill.recurring}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="text-right ml-4">
          <p className="text-xl font-bold text-gray-900">{formatCurrency(bill.amount)}</p>
          <p className="text-sm text-gray-500">{formatDate(bill.dueDate)}</p>
          {bill.accountName && (
            <p className="text-xs text-gray-400 mt-1">{bill.accountName}</p>
          )}
        </div>
      </div>
      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={() => onEdit(bill)}
          className="btn btn-secondary text-sm flex-1"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(bill.id)}
          className="btn btn-danger text-sm flex-1"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const BillList = () => {
  const { bills, currentView } = useApp();
  const [sortBy, setSortBy] = useState('dueDate');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingBill, setEditingBill] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const filteredAndSortedBills = useMemo(() => {
    let filtered = [...bills];

    // Filter by status
    if (filterStatus === 'unpaid') {
      filtered = filtered.filter(b => !b.paid);
    } else if (filterStatus === 'paid') {
      filtered = filtered.filter(b => b.paid);
    } else if (filterStatus === 'overdue') {
      filtered = filtered.filter(b => {
        const days = getDaysUntilDue(b.dueDate);
        return !b.paid && days < 0;
      });
    } else if (filterStatus === 'upcoming') {
      filtered = filtered.filter(b => {
        const days = getDaysUntilDue(b.dueDate);
        return !b.paid && days >= 0 && days <= 7;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else if (sortBy === 'amount') {
        return b.amount - a.amount;
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return filtered;
  }, [bills, sortBy, filterStatus]);

  const handleEdit = (bill) => {
    setEditingBill(bill);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this bill?')) {
      // Delete logic will be handled by parent
      window.dispatchEvent(new CustomEvent('deleteBill', { detail: id }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bills</h1>
          <p className="text-gray-500 mt-1">
            {bills.length} total, {bills.filter(b => !b.paid).length} unpaid
          </p>
        </div>
        <button
          onClick={() => {
            setEditingBill(null);
            setShowForm(true);
          }}
          className="btn btn-primary"
        >
          + Add Bill
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input"
            >
              <option value="dueDate">Due Date</option>
              <option value="amount">Amount</option>
              <option value="name">Name</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input"
            >
              <option value="all">All Bills</option>
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="upcoming">Due This Week</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bills List */}
      {filteredAndSortedBills.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg">No bills found</p>
          <p className="text-gray-400 mt-2">Add your first bill to get started!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredAndSortedBills.map(bill => (
            <BillCard
              key={bill.id}
              bill={bill}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Bill Form Modal */}
      {showForm && (
        <BillForm
          bill={editingBill}
          onClose={() => {
            setShowForm(false);
            setEditingBill(null);
          }}
        />
      )}
    </div>
  );
};

export default BillList;
