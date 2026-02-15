import { format, parseISO, differenceInDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

export const formatDate = (dateString) => {
  try {
    return format(parseISO(dateString), 'MMM d, yyyy');
  } catch {
    return dateString;
  }
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const getDaysUntilDue = (dueDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return differenceInDays(due, today);
};

export const getUrgencyLevel = (bill) => {
  if (bill.paid) return 'paid';

  const daysUntilDue = getDaysUntilDue(bill.dueDate);

  if (daysUntilDue < 0) return 'overdue';
  if (daysUntilDue <= 3) return 'urgent';
  if (daysUntilDue <= 7) return 'soon';
  return 'upcoming';
};

export const getUrgencyColor = (level) => {
  const colors = {
    paid: 'bg-green-100 text-green-800 border-green-200',
    overdue: 'bg-red-100 text-red-800 border-red-200',
    urgent: 'bg-orange-100 text-orange-800 border-orange-200',
    soon: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    upcoming: 'bg-green-100 text-green-800 border-green-200',
  };
  return colors[level] || colors.upcoming;
};

export const getUrgencyLabel = (level) => {
  const labels = {
    paid: 'Paid',
    overdue: 'Overdue',
    urgent: 'Due Soon',
    soon: 'This Week',
    upcoming: 'Upcoming',
  };
  return labels[level] || 'Unknown';
};

export const getBillsForMonth = (bills, year, month) => {
  return bills.filter(bill => {
    const dueDate = new Date(bill.dueDate);
    return dueDate.getFullYear() === year && dueDate.getMonth() === month;
  });
};

export const getBillsForWeek = (bills) => {
  const today = new Date();
  const weekEnd = new Date(today);
  weekEnd.setDate(today.getDate() + 7);

  return bills.filter(bill => {
    if (bill.paid) return false;
    const dueDate = new Date(bill.dueDate);
    return dueDate >= today && dueDate <= weekEnd;
  });
};

export const getOverdueBills = (bills) => {
  return bills.filter(bill => {
    if (bill.paid) return false;
    const daysUntilDue = getDaysUntilDue(bill.dueDate);
    return daysUntilDue < 0;
  });
};

export const getTotalUpcoming = (bills) => {
  const today = new Date();
  const monthEnd = endOfMonth(today);

  return bills
    .filter(bill => {
      if (bill.paid) return false;
      const dueDate = new Date(bill.dueDate);
      return dueDate >= today && dueDate <= monthEnd;
    })
    .reduce((sum, bill) => sum + bill.amount, 0);
};

export const getCalendarDays = (year, month) => {
  const monthStart = startOfMonth(new Date(year, month));
  const monthEnd = endOfMonth(new Date(year, month));
  return eachDayOfInterval({ start: monthStart, end: monthEnd });
};

export const getNextOccurrence = (bill) => {
  if (!bill.recurring || bill.recurring === 'none') return null;

  const lastDue = new Date(bill.dueDate);
  const next = new Date(lastDue);

  switch (bill.recurring) {
    case 'weekly':
      next.setDate(lastDue.getDate() + 7);
      break;
    case 'bi-weekly':
      next.setDate(lastDue.getDate() + 14);
      break;
    case 'monthly':
      next.setMonth(lastDue.getMonth() + 1);
      break;
    default:
      return null;
  }

  return next.toISOString().split('T')[0];
};

export const generateRecurringBills = (bills) => {
  const newBills = [];
  const today = new Date();

  bills.forEach(bill => {
    if (!bill.recurring || bill.recurring === 'none') return;

    let nextDate = getNextOccurrence(bill);
    let iterations = 0;
    const maxIterations = 12; // Generate up to 12 months ahead

    while (nextDate && new Date(nextDate) <= new Date(today.getFullYear(), today.getMonth() + 3, 1) && iterations < maxIterations) {
      const existingBill = bills.find(b =>
        b.name === bill.name &&
        b.dueDate === nextDate &&
        b.recurring === bill.recurring
      );

      if (!existingBill) {
        newBills.push({
          ...bill,
          id: undefined, // Will be generated when saved
          dueDate: nextDate,
        });
      }

      const tempBill = { ...bill, dueDate: nextDate };
      nextDate = getNextOccurrence(tempBill);
      iterations++;
    }
  });

  return newBills;
};
