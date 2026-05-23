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
        difficulty: 'Available',
        category: 'Backend',
        tags: ['Intermediate', 'E-commerce / Retail'],
        estimatedTime: '25 min',
        briefing: 'At 10:45, the Checkout API began returning HTTP 500s for a subset of requests. Initial logs indicate a potential memory issue or pool exhaustion. You need to identify the exact endpoint causing the issue and recommend a fix.',
        objectives: [
          'Identify the failing endpoint',
          'Diagnose the root cause of the 500s',
          'Write a post-mortem summary'
        ],
        evaluationCriteria: [
          'Speed of identification',
          'Accuracy of root cause analysis',
          'Clarity of communication'
        ],
        quiz: [
          {
            step: 1,
            question: "T+00:00 — You receive the pager alert for 500s on the Checkout API. What's the first dashboard you check?",
            hint: "Hint: You need a high-level overview of the service health.",
            options: [
              "The APM (Application Performance Monitoring) dashboard.",
              "The database slow query log.",
              "The load balancer access logs.",
              "The CI/CD deployment pipeline."],
            correctOptionIndex: 1
          },
          {
            step: 2,
            question: "T+05:00 — APM shows a massive spike in memory usage right before the 500s started. What command do you run to investigate the Node.js process?",
            hint: "Hint: We need to see what's eating the memory.",
            options: [
              "Take a heap snapshot (e.g., using v8-profiler).",
              "node --trace-gc",
              "top -p <pid>",
              "strace -p <pid>"],
            correctOptionIndex: 1
          },
          {
            step: 3,
            question: "T+15:00 — The heap snapshot reveals a massive array of 'CartItem' objects accumulating in memory. What is the likely cause?",
            hint: "Hint: Objects that aren't garbage collected are usually still referenced.",
            options: [
              "A global array is caching cart items and never clearing them.",
              "The database is returning too many rows.",
              "The garbage collector is turned off.",
              "Users are adding too many items to their carts.",
            correctOptionIndex: 1
        ],
        initialLogs: [
          '$ tail -f /var/log/checkout-service.log',
          '[ERR] 500 Internal Server Error: Pool Exhausted',
        ],
        initialChat: [
          { sender: 'coach', text: 'Welcome to S-101. The checkout service is returning 500s. Where should we look first?' },
            correctOptionIndex: 1,
      {
        id: 'S-102',
        title: 'Database Connection Pool Exhausted at 2 AM',
        desc: 'Infra · Advanced · 40 min',
        difficulty: 'In progress',
        category: 'Infra',
        tags: ['Advanced', 'Fintech / Banking'],
        estimatedTime: '40 min',
        briefing: 'At 02:14, the Checkout API began returning HTTP 500s for ~38% of requests. The on-call engineer reports a sustained p99 latency spike on /checkout to 8s. Two health-check failures tripped before the auto-rollback engaged. You have access to APM traces, the last deploy diff, slow-query logs, and the on-call\'s incident notes.',
        objectives: [
          'Identify the most likely root cause',
          'Recommend a containment action',
          'Draft a 1-page incident memo',
          'Flag any security or data-loss escalations'
        ],
        evaluationCriteria: [
          'Diagnostic reasoning quality',
          'Use of evidence over assumption',
          'User-impact prioritization',
          'Memo clarity and structure'
        ],
        quiz: [
          {
            step: 1,
            question: "T+00:00 — Checkout API is returning 500s for ~38% of requests. What do you check FIRST?",
            hint: "Hint: Pick the action with the highest signal-to-effort ratio.",
            options: [
              "Roll back the last deployment immediately.",
              "Check the APM traces for the failing checkout route.",
              "Restart the database cluster to clear connections.",
              "Page the network engineering team."],
            correctOptionIndex: 1
          },
          {
            step: 2,
            question: "T+05:00 — APM shows the database connection pool is 100% exhausted. What is the safest containment action?",
            hint: "Hint: We need to buy time without risking data loss or a massive outage.",
            options: [
              "Increase the connection pool limit from 100 to 500.",
              "Restart the PostgreSQL database.",
              "Implement an aggressive rate limit on the Checkout API.",
              "Disable the Checkout API completely."],
            correctOptionIndex: 1
          },
          {
            step: 3,
            question: "T+15:00 — Rate limits are in place. Traces show the /v1/checkout/apply-coupon route is holding connections open for 30s. What's the likely bug?",
            hint: "Hint: Why would a route hold a connection for exactly 30s?",
            options: [
              "A missing database index is causing slow sequential scans.",
              "The coupon table is locked by a background worker.",
              "A third-party coupon API is timing out and blocking the thread.",
              "An unhandled promise rejection is leaving connections unreleased."],
            correctOptionIndex: 1
          },
          {
            step: 4,
            question: "T+25:00 — You found it! A third-party API is timing out, and the catch block forgets to release the DB client. How do you fix it?",
            hint: "Hint: How do we ensure resources are cleaned up regardless of success or failure?",
            options: [
              "Wrap the DB call in a try/catch/finally block and release the client in finally.",
              "Increase the timeout limit for the third-party API.",
              "Remove the database call entirely.",
              "Restart the service periodically using a cron job."],
            correctOptionIndex: 1
          },
          {
            step: 5,
            question: "T+40:00 — The fix is deployed and latency is normal. Who should receive the incident post-mortem memo?",
            hint: "Hint: This incident impacted revenue and user experience.",
            options: [
              "Only the engineering team.",
              "Engineering, Product Leadership, and Customer Support.",
              "The CEO and the Board of Directors.",
              "No one, it's resolved.",
            correctOptionIndex: 1
        ],
        initialLogs: [],
        initialChat: [,
            correctOptionIndex: 1,
      {
        id: 'S-103',
        title: 'Failing Unit Tests After Dependency Upgrade',
        desc: 'Testing · Beginner · 15 min',
        difficulty: 'Completed',
        category: 'Testing',
        tags: ['Beginner', 'SaaS / Software'],
        estimatedTime: '15 min',
        briefing: 'A recent pull request updated several core dependencies, including the testing framework. Now, 14 unit tests in the authentication module are failing consistently in CI, despite passing locally for the author.',
        objectives: [
          'Review the CI test output',
          'Identify the breaking change in the dependency',
          'Fix the failing tests'
        ],
        evaluationCriteria: [
          'Ability to read CI logs',
          'Understanding of dependency management',
          'Test driven development practices'
        ],
        quiz: [
          {
            step: 1,
            question: "You review the CI output. The tests failing are all related to 'mockAuthClient'. What's your first instinct?",
            hint: "Hint: Read the error stack trace carefully.",
            options: [
              "The dependency upgrade changed how mocks are initialized or restored.",
              "The auth service is down in the testing environment.",
              "The test runner command has a syntax error.",
              "The author forgot to commit a file."],
            correctOptionIndex: 1
          },
          {
            step: 2,
            question: "You check the changelog of the upgraded testing library (Jest v29). It mentions 'Fake Timers no longer automatically mock process.nextTick'. How do you proceed?",
            hint: "Hint: We need to verify if this breaking change affects our code.",
            options: [
              "Search the codebase for 'useFakeTimers' and see if the failing tests rely on nextTick.",
              "Downgrade the library back to the previous version.",
              "Skip the 14 failing tests.",
              "Rewrite the tests to not use timers.",
            correctOptionIndex: 1
        ],
        initialLogs: [],
        initialChat: [,
            correctOptionIndex: 1,
      {
        id: 'S-104',
        title: 'Memory Leak in Node.js Worker',
        desc: 'Backend · Intermediate · 30 min',
        difficulty: 'Available',
        category: 'Backend',
        tags: ['Intermediate', 'Logistics / Supply Chain'],
        estimatedTime: '30 min',
        briefing: 'A background worker process responsible for processing large batch jobs has been crashing with OOM (Out of Memory) errors every 4 hours. The operations team has set up an auto-restart, but we need a permanent fix.',
        objectives: [
          'Analyze the heap snapshot',
          'Locate the memory leak in the worker code',
          'Implement a fix to properly garbage collect objects'
        ],
        evaluationCriteria: [
          'Profiling tool proficiency',
          'Understanding of Node.js memory management',
          'Code quality of the fix'
        ],
        quiz: [
          {
            step: 1,
            question: "The worker node crashes with 'JavaScript heap out of memory'. How do you initially contain this issue in production?",
            hint: "Hint: We need to keep the batch jobs processing while we investigate.",
            options: [
              "Configure PM2 (or Docker) to auto-restart the container with a memory limit slightly below the crash point.",
              "Stop the worker node entirely.",
              "Allocate 10x more RAM to the server.",
              "Delete the batch jobs from the queue."],
            correctOptionIndex: 1
          },
          {
            step: 2,
            question: "You pull a heap snapshot from production right before the crash. What tool do you use to analyze the .heapsnapshot file?",
            hint: "Hint: It's built into your browser.",
            options: [
              "Chrome DevTools (Memory tab).",
              "VS Code Debugger.",
              "Postman.",
              "Wireshark.",
            correctOptionIndex: 1
        ],
        initialLogs: [],
        initialChat: [,
            correctOptionIndex: 1
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
