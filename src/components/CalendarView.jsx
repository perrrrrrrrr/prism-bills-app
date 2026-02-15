import React from 'react';
import { useApp } from '../contexts/AppContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, parseISO } from 'date-fns';
import { formatCurrency, getUrgencyLevel, getUrgencyColor } from '../utils/helpers';

const CalendarView = () => {
  const { bills, selectedMonth, setSelectedMonth } = useApp();

  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get first day of week (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeek = monthStart.getDay();

  // Add padding days for the start of the month
  const paddingDays = Array(firstDayOfWeek).fill(null);

  // Get bills for each day
  const getBillsForDay = (day) => {
    return bills.filter(bill => {
      const dueDate = parseISO(bill.dueDate);
      return isSameDay(dueDate, day);
    });
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(selectedMonth);
    newMonth.setMonth(selectedMonth.getMonth() + direction);
    setSelectedMonth(newMonth);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setSelectedMonth(new Date())}
              className="px-3 py-1 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-700">
          {format(selectedMonth, 'MMMM yyyy')}
        </h2>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-gray-600">Paid</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-gray-600">Overdue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span className="text-gray-600">Due Soon (≤3 days)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span className="text-gray-600">This Week (≤7 days)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-gray-600">Upcoming</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="card overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div
              key={day}
              className="p-3 text-center text-sm font-semibold text-gray-600 bg-gray-50"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {/* Padding days */}
          {paddingDays.map((_, index) => (
            <div
              key={`padding-${index}`}
              className="min-h-[100px] p-2 border-b border-r border-gray-100 bg-gray-50/50"
            />
          ))}

          {/* Actual days */}
          {calendarDays.map(day => {
            const dayBills = getBillsForDay(day);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={day.toISOString()}
                className={`min-h-[100px] p-2 border-b border-r border-gray-100 ${
                  isToday ? 'bg-blue-50' : ''
                }`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isToday ? 'text-primary-600' : 'text-gray-700'
                }`}>
                  {format(day, 'd')}
                </div>
                <div className="space-y-1">
                  {dayBills.map(bill => {
                    const urgency = getUrgencyLevel(bill);
                    const urgencyColor = getUrgencyColor(urgency);

                    return (
                      <div
                        key={bill.id}
                        className={`text-xs p-1 rounded truncate ${urgencyColor}`}
                        title={`${bill.name}: ${formatCurrency(bill.amount)}`}
                      >
                        <span className={`font-medium ${bill.paid ? 'line-through' : ''}`}>
                          {bill.name}
                        </span>
                        {!bill.paid && (
                          <span className="ml-1 opacity-75">
                            {formatCurrency(bill.amount)}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Due</h3>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(
              bills
                .filter(b => {
                  const dueDate = parseISO(b.dueDate);
                  return isSameMonth(dueDate, selectedMonth) && !b.paid;
                })
                .reduce((sum, b) => sum + b.amount, 0)
            )}
          </p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Bills This Month</h3>
          <p className="text-2xl font-bold text-gray-900">
            {
              bills.filter(b => {
                const dueDate = parseISO(b.dueDate);
                return isSameMonth(dueDate, selectedMonth);
              }).length
            }
          </p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Paid This Month</h3>
          <p className="text-2xl font-bold text-green-600">
            {
              bills.filter(b => {
                const dueDate = parseISO(b.dueDate);
                return isSameMonth(dueDate, selectedMonth) && b.paid;
              }).length
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
