import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plus, List, Bell, ShieldCheck, Clock, Heart } from 'lucide-react';

export default function Home() {
  const features = [
    {
      title: 'Easy Scheduling',
      desc: 'Add your medications in seconds with our simple form.',
      icon: Clock,
      color: 'text-blue-400',
    },
    {
      title: 'Real-time Alerts',
      desc: 'Get browser notifications exactly when you need them.',
      icon: Bell,
      color: 'text-primary',
    },
    {
      title: 'Safe & Secure',
      desc: 'Your data stays on your device. No accounts needed.',
      icon: ShieldCheck,
      color: 'text-teal-400',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <div className="text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6">
            Never Miss a <span className="text-primary">Dose</span> Again.
          </h1>
          <p className="text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            The simplest medication reminder system designed for seniors. 
            Keep your health on track with high-contrast UI and instant alerts.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8"
        >
          <Link
            to="/add"
            className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-primary text-dark font-bold py-5 px-10 rounded-2xl neon-glow neon-glow-hover transition-all transform hover:-translate-y-1"
          >
            <Plus className="w-6 h-6" />
            <span>Add My First Medicine</span>
          </Link>
          <Link
            to="/view"
            className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold py-5 px-10 rounded-2xl transition-all"
          >
            <List className="w-6 h-6" />
            <span>View My Schedule</span>
          </Link>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 sm:mt-32">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              className="glass-card p-8 hover:border-primary/30 transition-colors group"
            >
              <div className={`p-4 bg-white/5 rounded-2xl w-fit mb-6 group-hover:bg-primary/10 transition-colors`}>
                <Icon className={`w-10 h-10 ${feature.color}`} />
              </div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="mt-32 p-12 glass-card text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
        <Heart className="w-16 h-16 text-red-400 mx-auto mb-6 animate-pulse" />
        <h2 className="text-3xl font-bold mb-4">Dedicated to Elderly Care</h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          We believe technology should be accessible to everyone. 
          Our mission is to help seniors maintain their independence through simple, 
          reliable digital tools.
        </p>
      </motion.div>
    </div>
  );
}
