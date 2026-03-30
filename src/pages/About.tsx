import React from 'react';
import { motion } from 'motion/react';
import { Info, Heart, Shield, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 sm:p-16 space-y-12"
      >
        <div className="text-center space-y-6">
          <div className="p-4 bg-primary/20 rounded-2xl w-fit mx-auto">
            <Info className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold">About ElderCare MedRemind</h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            Our mission is to empower seniors to manage their health independently 
            through technology that is intuitive, accessible, and respectful.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-primary">
              <Heart className="w-6 h-6" />
              <h3 className="text-2xl font-bold">Why We Built This</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Medication adherence is critical for elderly health. We noticed that many 
              apps are too complex, with small text and confusing interfaces. 
              ElderCare MedRemind solves this with a high-contrast, large-text design.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-teal-400">
              <Shield className="w-6 h-6" />
              <h3 className="text-2xl font-bold">Privacy First</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              We don't collect your data. Everything you save is stored locally on 
              your device using LocalStorage. No accounts, no tracking, no worries.
            </p>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 text-center">
          <div className="flex items-center justify-center space-x-3 text-gray-400 mb-4">
            <Users className="w-6 h-6" />
            <span className="text-xl font-bold">Built for Families</span>
          </div>
          <p className="text-gray-500">
            Designed with love for grandparents everywhere. 
            Version 1.0.0 • 2026
          </p>
        </div>
      </motion.div>
    </div>
  );
}
