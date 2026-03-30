import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AddReminder from './pages/AddReminder';
import ViewReminders from './pages/ViewReminders';
import Notifications from './pages/Notifications';
import About from './pages/About';
import Assistant from './pages/Assistant';
import FindPharmacy from './pages/FindPharmacy';
import { Reminder } from './types';

export default function App() {
  const notifiedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentTimeStr = now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      const reminders: Reminder[] = JSON.parse(localStorage.getItem('reminders') || '[]');
      const todayKey = now.toDateString();

      reminders.forEach(reminder => {
        const notificationKey = `${todayKey}-${reminder.id}-${reminder.time}`;
        
        if (reminder.time === currentTimeStr && !notifiedRef.current.has(notificationKey)) {
          if (Notification.permission === 'granted') {
            new Notification("Time for Medication!", {
              body: `It's time to take ${reminder.medicineName} (${reminder.dosage}).`,
              icon: "/vite.svg",
              tag: reminder.id,
              requireInteraction: true
            });
            notifiedRef.current.add(notificationKey);
          }
        }
      });

      // Clear old notifications from ref once a new day starts
      if (notifiedRef.current.size > 100) {
        notifiedRef.current.clear();
      }
    };

    const interval = setInterval(checkReminders, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<AddReminder />} />
            <Route path="/view" element={<ViewReminders />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/about" element={<About />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/pharmacy" element={<FindPharmacy />} />
          </Routes>
        </main>
        <footer className="py-12 border-t border-white/5 text-center text-gray-500">
          <p>© 2026 ElderCare MedRemind. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}
