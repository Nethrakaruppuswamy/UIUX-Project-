import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Bell, ShieldCheck, Smartphone, MousePointer2, CheckCircle2 } from 'lucide-react';

export default function Notifications() {
  const [permission, setPermission] = useState<NotificationPermission>(Notification.permission);

  const requestPermission = async () => {
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === 'granted') {
      new Notification("ElderCare MedRemind", {
        body: "Success! You will now receive medication alerts.",
        icon: "/vite.svg"
      });
    }
  };

  const steps = [
    {
      title: 'Enable Permissions',
      desc: 'Click the button below to allow this website to send you alerts.',
      icon: MousePointer2,
    },
    {
      title: 'Keep Browser Open',
      desc: 'Ensure your browser is active or running in the background.',
      icon: Smartphone,
    },
    {
      title: 'Stay Safe',
      desc: 'Receive timely alerts for every dose you schedule.',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 space-y-4"
      >
        <div className="p-4 bg-primary/20 rounded-2xl w-fit mx-auto mb-6">
          <Bell className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold">Notifications Guide</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Learn how to set up automatic alerts so you never miss a medication dose.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={idx} className="glass-card p-8 text-center space-y-4">
              <div className="p-4 bg-white/5 rounded-2xl w-fit mx-auto">
                <Icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">{step.title}</h3>
              <p className="text-gray-400">{step.desc}</p>
            </div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-12 text-center"
      >
        <h2 className="text-3xl font-bold mb-8">Test Your Notifications</h2>
        
        {permission === 'granted' ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-3 text-green-400 bg-green-400/10 px-6 py-3 rounded-full border border-green-400/20">
              <CheckCircle2 className="w-6 h-6" />
              <span className="font-bold">Notifications Enabled</span>
            </div>
            <button
              onClick={() => {
                new Notification("Test Alert", { body: "This is how your reminder will look!" });
              }}
              className="text-primary hover:underline mt-4"
            >
              Send a test alert again
            </button>
          </div>
        ) : permission === 'denied' ? (
          <div className="space-y-4">
            <p className="text-red-400 font-bold">Notifications are blocked in your browser settings.</p>
            <p className="text-gray-400">Please click the lock icon in your address bar to reset permissions.</p>
          </div>
        ) : (
          <button
            onClick={requestPermission}
            className="bg-primary text-dark font-bold py-5 px-12 rounded-2xl neon-glow neon-glow-hover transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-3 mx-auto"
          >
            <Bell className="w-6 h-6" />
            <span>Enable Alerts Now</span>
          </button>
        )}
      </motion.div>
    </div>
  );
}
