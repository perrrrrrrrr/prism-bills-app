import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';
import { notifications } from '../utils/notifications';
import { getOverdueBills, getBillsForWeek } from '../utils/helpers';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [bills, setBills] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  // Load data from storage
  useEffect(() => {
    const loadData = () => {
      const data = storage.getData();
      setBills(data.bills);
      setAccounts(data.accounts);
      setSettings(data.settings);
      setLoading(false);
    };

    loadData();

    // Request notification permission
    notifications.requestPermission();
  }, []);

  // Save bills whenever they change
  useEffect(() => {
    if (!loading) {
      storage.saveData({ bills, accounts, settings });
    }
  }, [bills, accounts, settings, loading]);

  // Check for notifications periodically
  useEffect(() => {
    if (!settings?.notificationsEnabled) return;

    const checkNotifications = () => {
      notifications.checkBills(bills);
    };

    // Check immediately and then every hour
    checkNotifications();
    const interval = setInterval(checkNotifications, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [bills, settings]);

  const addBill = useCallback((bill) => {
    const newBill = storage.addBill(bill);
    setBills(prev => [...prev, newBill]);
    return newBill;
  }, []);

  const updateBill = useCallback((id, updates) => {
    const updated = storage.updateBill(id, updates);
    if (updated) {
      setBills(prev => prev.map(b => b.id === id ? updated : b));
    }
    return updated;
  }, []);

  const deleteBill = useCallback((id) => {
    storage.deleteBill(id);
    setBills(prev => prev.filter(b => b.id !== id));
  }, []);

  const markBillPaid = useCallback((id, paid = true) => {
    const updated = storage.markBillPaid(id, paid);
    if (updated) {
      setBills(prev => prev.map(b => b.id === id ? updated : b));
    }
    return updated;
  }, []);

  const addAccount = useCallback((account) => {
    const newAccount = storage.addAccount(account);
    setAccounts(prev => [...prev, newAccount]);
    return newAccount;
  }, []);

  const updateAccount = useCallback((id, updates) => {
    const updated = storage.updateAccount(id, updates);
    if (updated) {
      setAccounts(prev => prev.map(a => a.id === id ? updated : a));
    }
    return updated;
  }, []);

  const deleteAccount = useCallback((id) => {
    storage.deleteAccount(id);
    setAccounts(prev => prev.filter(a => a.id !== id));
    setBills(prev => prev.map(b => b.accountId === id ? { ...b, accountId: null } : b));
  }, []);

  const updateSettings = useCallback((updates) => {
    const updated = storage.updateSettings(updates);
    setSettings(updated);
    return updated;
  }, []);

  const value = {
    bills,
    accounts,
    settings,
    loading,
    currentView,
    selectedMonth,
    setCurrentView,
    setSelectedMonth,
    addBill,
    updateBill,
    deleteBill,
    markBillPaid,
    addAccount,
    updateAccount,
    deleteAccount,
    updateSettings,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
