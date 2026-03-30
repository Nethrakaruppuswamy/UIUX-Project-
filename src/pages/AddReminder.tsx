import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Reminder } from '../types';

export default function AddReminder() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    medicineName: '',
    dosage: '',
    time: '',
    frequency: 'Once Daily',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newReminder: Reminder = {
      id: crypto.randomUUID(),
      ...formData,
      createdAt: Date.now(),
    };

    const existingReminders = JSON.parse(localStorage.getItem('reminders') || '[]');
    localStorage.setItem('reminders', JSON.stringify([...existingReminders, newReminder]));

    setShowSuccess(true);
    setTimeout(() => {
      navigate('/view');
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 sm:p-12"
      >
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-3 bg-primary/20 rounded-xl">
            <Save className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Add New Medication</h1>
        </div>

        {showSuccess ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center space-y-4"
          >
            <CheckCircle2 className="w-20 h-20 text-green-400" />
            <h2 className="text-3xl font-bold">Medication Saved!</h2>
            <p className="text-gray-400">Redirecting to your schedule...</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="block text-xl font-medium text-gray-300">Medicine Name</label>
              <input
                required
                type="text"
                placeholder="e.g. Aspirin"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-600"
                value={formData.medicineName}
                onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })}
              />
            </div>

            <div className="space-y-3">
              <label className="block text-xl font-medium text-gray-300">Dosage</label>
              <input
                required
                type="text"
                placeholder="e.g. 500mg (1 Tablet)"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-600"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="block text-xl font-medium text-gray-300">Time</label>
                <input
                  required
                  type="time"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <label className="block text-xl font-medium text-gray-300">Frequency</label>
                <select
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none"
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                >
                  <option className="bg-dark">Once Daily</option>
                  <option className="bg-dark">Twice Daily</option>
                  <option className="bg-dark">Three Times Daily</option>
                  <option className="bg-dark">As Needed</option>
                </select>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-primary text-dark font-bold py-5 px-8 rounded-2xl neon-glow neon-glow-hover transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-3"
              >
                <Save className="w-6 h-6" />
                <span>Save Reminder</span>
              </button>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <p className="text-base text-blue-200">
                Tip: Make sure to enable browser notifications in the "Guide" section to receive alerts.
              </p>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
