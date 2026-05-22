import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Scenario from './models/Scenario.js';
import PortfolioItem from './models/PortfolioItem.js';

dotenv.config();

const seedDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/workready';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing
    await Scenario.deleteMany({});
    await PortfolioItem.deleteMany({});

    // Seed Scenarios
    const scenarios = [
      {
        id: 'S-101',
        title: 'Production API Returning 500s — Checkout Service',
        desc: 'Backend · Intermediate · 25 min',
        difficulty: 'Available', // Using difficulty field for status to match frontend mock
        initialLogs: [
          '$ tail -f /var/log/checkout-service.log',
          '[ERR] 500 Internal Server Error: Pool Exhausted',
        ],
        initialChat: [
          { sender: 'coach', text: 'Welcome to S-101. The checkout service is returning 500s. Where should we look first?' }
        ]
      },
      {
        id: 'S-102',
        title: 'Database Connection Pool Exhausted at 2 AM',
        desc: 'Infra · Advanced · 40 min',
        difficulty: 'In progress',
        initialLogs: [],
        initialChat: []
      },
      {
        id: 'S-104',
        title: 'Memory Leak in Node.js Worker',
        desc: 'Backend · Intermediate · 30 min',
        difficulty: 'Available',
        initialLogs: [],
        initialChat: []
      }
    ];

    await Scenario.insertMany(scenarios);
    console.log('Scenarios seeded!');

    // Seed Portfolio Items (Evidence List)
    const portfolioItems = [
      { id: 'EV-01', title: 'Process Map', status: 'Completed', score: '90/100', topic: 'blue', scenarioId: '101' },
      { id: 'EV-02', title: 'Safety & Quality Checklist', status: 'Completed', score: '85/100', topic: 'green', scenarioId: '101' },
      { id: 'EV-03', title: 'RCA Log', status: 'Needs review', score: '70/100', topic: 'yellow', scenarioId: '102' },
      { id: 'EV-04', title: 'Technical Memo', status: 'Needs revision', score: '55/100', topic: 'orange', scenarioId: '102' },
      { id: 'EV-05', title: 'AI Usage Log', status: 'Completed', score: '80/100', topic: 'purple', scenarioId: '104' }
    ];

    await PortfolioItem.insertMany(portfolioItems);
    console.log('Portfolio Items seeded!');

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding DB:', err);
    process.exit(1);
  }
};

seedDB();
