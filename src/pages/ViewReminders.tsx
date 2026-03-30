import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Clock, Calendar, Pill, AlertCircle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Reminder } from '../types';

export default function ViewReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('reminders') || '[]');
    // Sort by time
    const sorted = saved.sort((a: Reminder, b: Reminder) => a.time.localeCompare(b.time));
    setReminders(sorted);
  }, []);

  const deleteReminder = (id: string) => {
    const updated = reminders.filter(r => r.id !== id);
    localStorage.setItem('reminders', JSON.stringify(updated));
    setReminders(updated);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-primary/20 rounded-xl">
            <Calendar className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">My Schedule</h1>
            <p className="text-gray-400">Manage your daily medications</p>
          </div>
        </div>
        
        {reminders.length > 0 && (
          <Link
            to="/add"
            className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-xl transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Add More</span>
          </Link>
        )}
      </div>

      {reminders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-16 text-center space-y-6"
        >
          <div className="p-6 bg-white/5 rounded-full w-fit mx-auto">
            <Pill className="w-16 h-16 text-gray-600" />
          </div>
          <h2 className="text-3xl font-bold">No Reminders Yet</h2>
          <p className="text-xl text-gray-400 max-w-md mx-auto">
            Your medication schedule is empty. Add your first medicine to get started.
          </p>
          <div className="pt-4">
            <Link
              to="/add"
              className="inline-flex items-center space-x-3 bg-primary text-dark font-bold py-5 px-10 rounded-2xl neon-glow transition-all hover:-translate-y-1"
            >
              <Plus className="w-6 h-6" />
              <span>Add Medication</span>
            </Link>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode="popLayout">
            {reminders.map((reminder) => (
              <motion.div
                key={reminder.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group hover:border-primary/20 transition-all"
              >
                <div className="flex items-center space-x-6">
                  <div className="p-4 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-colors">
                    <Pill className="w-10 h-10 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-white">{reminder.medicineName}</h3>
                    <div className="flex flex-wrap gap-4 text-gray-400">
                      <span className="flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5 text-teal-400" />
                        <span>{reminder.dosage}</span>
                      </span>
                      <span className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-blue-400" />
                        <span className="font-bold text-white">{reminder.time}</span>
                      </span>
                      <span className="bg-white/5 px-3 py-1 rounded-lg text-sm border border-white/5">
                        {reminder.frequency}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => deleteReminder(reminder.id)}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-6 py-4 rounded-xl transition-all"
                  aria-label="Delete reminder"
                >
                  <Trash2 className="w-6 h-6" />
                  <span className="sm:hidden">Delete Reminder</span>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
