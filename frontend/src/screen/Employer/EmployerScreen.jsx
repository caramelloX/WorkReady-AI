import React, { useState, useEffect } from 'react';
import './EmployerScreen.css';

export default function EmployerScreen({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState('All tracks');
  const [experienceFilter, setExperienceFilter] = useState('Any');
  
  // Slide-out modal state
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Mock candidates database (8 high-quality portfolios)
  const candidates = [
    {
      id: 'cand-01',
      name: 'Aarav Sharma',
      avatar: 'AS',
      university: 'IIT Bombay',
      location: 'Bengaluru',
      role: 'Backend',
      score: 96,
      skills: ['Node.js', 'Python', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes'],
      scenarios: 12,
      rcaRating: 4.8,
      evidence: 8,
      availability: 'Immediate',
      email: 'aarav.sharma@iitb.ac.in',
      phone: '+91 98765 43210',
      linkedin: 'linkedin.com/in/aarav-sharma-dev',
      website: 'aaravsharma.dev',
      summary: 'Focused Backend Engineer specializing in high-throughput microservices and distributed databases. Deep expertise in incident diagnostics, caching strategies, and secure database pooling mechanisms.',
      education: {
        university: 'IIT Bombay',
        degree: 'B.Tech in Computer Science',
        year: 'Class of 2026'
      },
      processMap: ['Client request', 'Auth gateway', 'Route controller', 'Service layer', 'Database pool', 'Redis cache', 'Prometheus monitoring'],
      reliabilityGuardrails: [
        'Enforced 90%+ unit test coverage on critical billing flows.',
        'Implemented circuit breaker patterns (Resilience4j style) on external API integrations.',
        'Configured automated health-check endpoints and liveness/readiness probes in Kubernetes.',
        'Automated integration test suites running on GitHub Actions CI/CD pipelines.'
      ],
      rca: {
        title: 'Outage #104: Connection Pool Leak in Payment Service',
        cause: 'Uncommitted database transaction block left connections in an idle-in-transaction state during sudden request spikes, exhausting the HikariCP pool.',
        fix: 'Wrapped database connection invocations in try-with-resources blocks and configured explicit connection leak detection timeouts in application properties.',
        rating: 4.9
      },
      memo: {
        title: 'RFC-044: Migration plan to Distributed Redis Cache',
        summary: 'Proposes transitioning the primary user session state from server memory to an decoupled distributed Redis Cluster to enable seamless horizontal autoscaling of application pods.',
        link: 'https://docs.google.com/document/d/1wR-044-redis/edit'
      },
      aiUsage: {
        tools: ['GitHub Copilot', 'Cursor'],
        bullets: [
          'Used Cursor composer to generate boilerplate schema migrations and SQL DDL scripts rapidly.',
          'Leveraged GitHub Copilot for auto-completing complex exception handlers and structural logs.',
          'Maintained rigorous code review to ensure zero security leaks or hallucinated library imports.'
        ]
      },
      experience: [
        {
          title: 'Backend Engineering Intern',
          company: 'Stripe Diagnostics Inc.',
          dates: 'May 2025 - Aug 2025',
          bullets: [
            'Assisted in profiling database latency and optimized transaction locks, reducing query queues by 18%.',
            'Authored comprehensive post-mortems for staging environment memory leak incidents.',
            'Maintained high-availability API gateway routes handling 2,000+ RPS.'
          ]
        }
      ],
      mentorReviews: [
        {
          project: 'Connection Pool Outage Resolution',
          description: 'Successfully analyzed Hikari leak logs and patched transaction block configurations.',
          reviewer: 'Alex Carter (Lead Coach, Stripe)',
          rating: 4.8
        },
        {
          project: 'Security Middleware Sanitizer',
          description: 'Implemented strict URI parameter normalization middleware, passing security audits.',
          reviewer: 'Sarah Vance (Staff Engineer, Google)',
          rating: 4.9
        }
      ],
      certifications: [
        'AWS Certified Solutions Architect – Associate',
        'Certified Kubernetes Application Developer (CKAD)'
      ]
    },
    {
      id: 'cand-02',
      name: 'Diya Patel',
      avatar: 'DP',
      university: 'BITS Pilani',
      location: 'Mumbai',
      role: 'Frontend',
      score: 91,
      skills: ['React', 'TypeScript', 'Redux', 'Vanilla CSS', 'Next.js', 'Vite', 'Figma'],
      scenarios: 10,
      rcaRating: 4.6,
      evidence: 6,
      availability: '30 days',
      email: 'diya.patel@bits-pilani.ac.in',
      phone: '+91 87654 32109',
      linkedin: 'linkedin.com/in/diya-patel-frontend',
      website: 'diyapatel.design',
      summary: 'Frontend Engineer passionate about building visually gorgeous, highly responsive, and accessible user interfaces. Experienced in modern client state management, performance diagnostics, and component library design.',
      education: {
        university: 'BITS Pilani',
        degree: 'B.E. in Computer Science',
        year: 'Class of 2026'
      },
      processMap: ['User action', 'State dispatcher', 'Component rendering', 'Virtual DOM', 'CSS painting', 'Analytics telemetry'],
      reliabilityGuardrails: [
        'Enforced strict TypeScript compilation flags (noImplicitAny).',
        'Configured automated Jest and React Testing Library suites for critical user checkout funnels.',
        'Conformed fully to WCAG 2.1 AA accessibility guidelines (screen readers, keyboard nav).',
        'Monitored client bundle sizes and implemented route-based code splitting.'
      ],
      rca: {
        title: 'Incident #302: Memory Leak in Infinite Scroll Feed',
        cause: 'React event listeners on window scroll were not cleaned up during component unmounting, causing active memory consumption to compound.',
        fix: 'Refactored feed layout to use IntersectionObserver API and ensured listener cleanups in useEffect return scopes.',
        rating: 4.7
      },
      memo: {
        title: 'RFC-012: Migration to Client CSS-in-JS System',
        summary: 'Proposes adopting HSL tailored custom variables to enable highly flexible light/dark mode triggers with zero cumulative layout shifts.',
        link: 'https://docs.google.com/document/d/1d-012-css-vars/edit'
      },
      aiUsage: {
        tools: ['GitHub Copilot', 'v0'],
        bullets: [
          'Used v0 to quickly mock up clean dashboard sidebar and grid container layouts.',
          'Used GitHub Copilot to accelerate coding repetitive JSX structures and icon sets.',
          'Verified manual alignment and accessibility states strictly without relying on automated AI recommendations.'
        ]
      },
      experience: [
        {
          title: 'Frontend Engineer Intern',
          company: 'Razorpay Diagnostics',
          dates: 'Jan 2025 - Jun 2025',
          bullets: [
            'Redesigned the employer assessment module dashboard using custom CSS and React grids.',
            'Improved initial page load performance metrics by 24% through deferred script loading.',
            'Integrated telemetry monitors to record user drop-off flows.'
          ]
        }
      ],
      mentorReviews: [
        {
          project: 'Visual Assessment Workspace',
          description: 'Designed a premium, responsive master-detail review workspace receiving outstanding feedback.',
          reviewer: 'Alex Carter (Lead Coach, Stripe)',
          rating: 4.6
        }
      ],
      certifications: [
        'UX Design Certificate - Google Career Academy',
        'Frontend Development Professional - Meta Certification'
      ]
    },
    {
      id: 'cand-03',
      name: 'Rohan Mehta',
      avatar: 'RM',
      university: 'IIT Delhi',
      location: 'Delhi',
      role: 'DevOps',
      score: 88,
      skills: ['AWS', 'Terraform', 'Kubernetes', 'CI/CD', 'GitHub Actions', 'Prometheus', 'Bash'],
      scenarios: 8,
      rcaRating: 4.4,
      evidence: 5,
      availability: 'Immediate',
      email: 'rohan.mehta@iitd.ac.in',
      phone: '+91 76543 21098',
      linkedin: 'linkedin.com/in/rohan-mehta-devops',
      website: 'rohanmehta.infra',
      summary: 'Cloud Infrastructure and DevOps specialist. Expertise in designing scalable Kubernetes architectures, declarative Terraform pipelines, and automated liveness monitoring platforms.',
      education: {
        university: 'IIT Delhi',
        degree: 'B.Tech in CS & Engineering',
        year: 'Class of 2026'
      },
      processMap: ['Code Push', 'GitHub Actions CI', 'Docker Build', 'Artifact Registry', 'Helm Upgrade', 'K8s Cluster rollout', 'Datadog alerts'],
      reliabilityGuardrails: [
        'Enforced mandatory Terraform linting and security checking in CI.',
        'Implemented custom Prometheus alerts triggering Slack warnings on high container CPU loads.',
        'Automated canary deployment configurations inside Kubernetes clusters.',
        'Managed all database credentials securely via HashiCorp Vault.'
      ],
      rca: {
        title: 'Incident #501: DNS Outage due to Kubernetes CoreDNS Spikes',
        cause: 'Sudden horizontal scaling of microservices caused DNS query exhaustion on standard CoreDNS deployments due to missing upstream caching.',
        fix: 'Configured node-local DNS caching on all worker nodes and updated replica counts of CoreDNS deployments.',
        rating: 4.5
      },
      memo: {
        title: 'RFC-089: GitOps infrastructure continuous delivery',
        summary: 'Proposes migrating standard command-line kubectl rollouts to a declarative GitOps engine (ArgoCD) to avoid configuration drift.',
        link: 'https://docs.google.com/document/d/1r-089-gitops/edit'
      },
      aiUsage: {
        tools: ['GitHub Copilot', 'Cursor'],
        bullets: [
          'Used Copilot to generate complex shell scripts and base Terraform variables blocks rapidly.',
          'Used Cursor to review Kubernetes Helm chart configurations.',
          'Validated syntax and executed extensive dry-run verification tests on staging clusters.'
        ]
      },
      experience: [
        {
          title: 'Infrastructure Intern',
          company: 'DevOps Diagnostics LLC',
          dates: 'Jun 2025 - Sep 2025',
          bullets: [
            'Reduced CI/CD build runtimes by 35% through caching Docker build stages.',
            'Migrated legacy AWS CloudFormation templates to declarative Terraform modules.',
            'Implemented log-scraping filters using FluentD.'
          ]
        }
      ],
      mentorReviews: [
        {
          project: 'Kubernetes Cluster Provisioning',
          description: 'Successfully created modular, secure, and auto-scaling EKS templates from scratch.',
          reviewer: 'Sarah Vance (Staff Engineer, Google)',
          rating: 4.4
        }
      ],
      certifications: [
        'HashiCorp Certified: Terraform Associate',
        'AWS Certified Cloud Practitioner'
      ]
    },
    {
      id: 'cand-04',
      name: 'Sara Khan',
      avatar: 'SK',
      university: 'IIIT Hyderabad',
      location: 'Hyderabad',
      role: 'Security',
      score: 95,
      skills: ['OAuth2', 'JWT', 'OWASP Top 10', 'Pen Testing', 'Node.js', 'Python', 'Nmap'],
      scenarios: 14,
      rcaRating: 4.9,
      evidence: 9,
      availability: 'Immediate',
      email: 'sara.khan@iiit.ac.in',
      phone: '+91 65432 10987',
      linkedin: 'linkedin.com/in/sara-khan-security',
      website: 'sarakhan.sec',
      summary: 'Application Security Engineer focused on building robust authentication systems, secure middleware interceptors, and defending APIs against standard OWASP vulnerabilities.',
      education: {
        university: 'IIIT Hyderabad',
        degree: 'B.Tech in CS & Security',
        year: 'Class of 2026'
      },
      processMap: ['Client Request', 'WAF Filter', 'OAuth Validation', 'JWT Decryption', 'Context Sanitization', 'Secure Service Exec'],
      reliabilityGuardrails: [
        'Configured static application security testing (SAST) plugins in pipelines.',
        'Implemented automated token expiration and cryptographically secure JWT hashing.',
        'Conformed API structures to OWASP Top 10 mitigation guidelines.',
        'Conducted regular penetration audits on testing servers.'
      ],
      rca: {
        title: 'Incident #902: Unauthorized Access Bypass via Path Traversal',
        cause: 'Lack of input normalization on attachment downloading route allowed path traversal parameters to bypass validation regex filters.',
        fix: 'Implemented strict URI normalizer interceptors in gateway filters, ensuring resource containment checks.',
        rating: 4.95
      },
      memo: {
        title: 'RFC-104: Secure Token Rotation Mechanism',
        summary: 'Proposes transitioning to a secure database-backed refresh token rotation schema to prevent replay hijacks.',
        link: 'https://docs.google.com/document/d/1s-104-token-rot/edit'
      },
      aiUsage: {
        tools: ['GitHub Copilot'],
        bullets: [
          'Used GitHub Copilot to mock complex test vectors for SQL injections and path traversal.',
          'Ensured that all AI suggestions for cryptography were manually validated using industry-standard libraries.',
          'Avoided generating sensitive keys or secrets using AI autocomplete tools.'
        ]
      },
      experience: [
        {
          title: 'Security Analyst Intern',
          company: 'Cyber Diagnostics Co.',
          dates: 'May 2025 - Jul 2025',
          bullets: [
            'Audited 12 Node.js services and resolved 8 key vulnerabilities.',
            'Integrated automated API dependency scanning libraries in deployment configurations.',
            'Assisted in running internal spear-phishing simulation exercises.'
          ]
        }
      ],
      mentorReviews: [
        {
          project: 'Secure Access Token Patches',
          description: 'Successfully diagnosed vulnerability pathways and patched gateway middleware.',
          reviewer: 'Alex Carter (Lead Coach, Stripe)',
          rating: 4.9
        }
      ],
      certifications: [
        'CompTIA Security+',
        'Offensive Security Certified Professional (OSCP) - Candidate'
      ]
    },
    {
      id: 'cand-05',
      name: 'Vikram Singh',
      avatar: 'VS',
      university: 'IIT Madras',
      location: 'Pune',
      role: 'Fullstack',
      score: 87,
      skills: ['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind', 'Docker', 'REST APIs'],
      scenarios: 9,
      rcaRating: 4.3,
      evidence: 4,
      availability: '60 days',
      email: 'vikram.singh@iitm.ac.in',
      phone: '+91 54321 09876',
      linkedin: 'linkedin.com/in/vikram-singh-fullstack',
      website: 'vikramstack.xyz',
      summary: 'Versatile Fullstack Software Engineer with experience building responsive web architectures. Competent in both frontend UI creation and backend API integration.',
      education: {
        university: 'IIT Madras',
        degree: 'B.Tech in Computer Science',
        year: 'Class of 2026'
      },
      processMap: ['UI Form Trigger', 'Fetch Request', 'Express Router', 'Controller Handler', 'MongoDB query', 'JSON Response', 'State Update'],
      reliabilityGuardrails: [
        'Wrote comprehensive end-to-end integration tests using Playwright.',
        'Implemented rate-limiting filters on external API route handlers.',
        'Configured graceful application shutdown hooks to release DB resources.',
        'Maintained consistent CSS and style spacing parameters across components.'
      ],
      rca: {
        title: 'Incident #112: Database Exhaustion in Search Endpoint',
        cause: 'Lack of indexing on name query scopes led to full table scans on MongoDB collections during high volume queries.',
        fix: 'Implemented compound text indexes on name, university, and skill parameters, decreasing response latency by 85%.',
        rating: 4.5
      },
      memo: {
        title: 'RFC-018: Standardizing Component Styling Guidelines',
        summary: 'Proposes establishing layout structures using a clean modular stylesheet to ensure uniformity across candidate cards.',
        link: 'https://docs.google.com/document/d/1v-018-styles/edit'
      },
      aiUsage: {
        tools: ['GitHub Copilot', 'Cursor'],
        bullets: [
          'Used Copilot to generate schema templates and express route skeletons.',
          'Employed Cursor to identify code smells and redundant css blocks.',
          'Manually verified visual layouts on desktop and tablet monitors.'
        ]
      },
      experience: [
        {
          title: 'Fullstack Development Intern',
          company: 'SaaS Diagnostics Co.',
          dates: 'Jul 2025 - Oct 2025',
          bullets: [
            'Created a responsive student details modal dashboard.',
            'Optimized database aggregation queries, improving speeds by 20%.',
            'Collaborated with designers to enforce consistent color schemes.'
          ]
        }
      ],
      mentorReviews: [
        {
          project: 'Talent Roster Table Grid',
          description: 'Successfully refactored visual grid tables, enhancing responsiveness.',
          reviewer: 'Sarah Vance (Staff Engineer, Google)',
          rating: 4.3
        }
      ],
      certifications: [
        'FreeCodeCamp Responsive Web Design',
        'Certified Scrum Developer (CSD)'
      ]
    },
    {
      id: 'cand-06',
      name: 'Neha Verma',
      avatar: 'NV',
      university: 'Anna University',
      location: 'Chennai',
      role: 'AI / Data',
      score: 92,
      skills: ['Python', 'TensorFlow', 'LLMs', 'SQL', 'PyTorch', 'Vector DBs', 'FastAPI'],
      scenarios: 11,
      rcaRating: 4.7,
      evidence: 7,
      availability: '30 days',
      email: 'neha.verma@annauniv.edu',
      phone: '+91 43210 98765',
      linkedin: 'linkedin.com/in/neha-verma-ai',
      website: 'nehaverma.ai',
      summary: 'Data Scientist and AI Engineer. Experience in integrating large language models with vector databases, configuring FastAPI wrappers, and preprocessing massive token queues.',
      education: {
        university: 'Anna University',
        degree: 'B.E. in CS (AI & ML Focus)',
        year: 'Class of 2026'
      },
      processMap: ['User Prompt', 'FastAPI Interceptor', 'Embedding Gen', 'Vector DB Lookup', 'LLM Context Injection', 'Safety Filter', 'Stream Output'],
      reliabilityGuardrails: [
        'Implemented token counting middleware to avoid prompt budget exhaustion.',
        'Configured automated toxicity filters and guardrails on LLM completions.',
        'Conducted extensive validation tests to ensure zero hallucinatory output loops.',
        'Maintained localized unit tests for vector DB aggregation pipelines.'
      ],
      rca: {
        title: 'Incident #704: Outage in Vector Search Retrieval',
        cause: 'Invalid token delimiters caused embedding dimensions mismatch, triggering raw database server errors on API queries.',
        fix: 'Implemented validation schemas inside FastAPI middleware to filter invalid token vectors prior to DB queries.',
        rating: 4.8
      },
      memo: {
        title: 'RFC-056: Migration to Local LLM Inference Engines',
        summary: 'Proposes adopting self-hosted inference servers to protect sensitive user diagnostic data and lower API operational budgets.',
        link: 'https://docs.google.com/document/d/1n-056-inference/edit'
      },
      aiUsage: {
        tools: ['Cursor', 'GitHub Copilot'],
        bullets: [
          'Used Cursor to rapidly generate complex FastAPI routers.',
          'Used Copilot to generate seed scripts for vector database operations.',
          'Ensured complete accuracy by cross-verifying prompt logic with industry benchmarks.'
        ]
      },
      experience: [
        {
          title: 'AI Engineering Intern',
          company: 'AI Diagnostics Group',
          dates: 'Mar 2025 - Aug 2025',
          bullets: [
            'Configured a retrieval-augmented generation (RAG) vector repository containing 10,000+ files.',
            'Reduced model API latencies by 30% through caching prompt templates.',
            'Implemented clean streaming controllers to output real-time completions.'
          ]
        }
      ],
      mentorReviews: [
        {
          project: 'Tokenizer Integration Pipeline',
          description: 'Successfully created resilient vector retrieval services under high concurrency loads.',
          reviewer: 'Alex Carter (Lead Coach, Stripe)',
          rating: 4.7
        }
      ],
      certifications: [
        'TensorFlow Developer Certificate',
        'DeepLearning.AI Generative AI Professional'
      ]
    },
    {
      id: 'cand-07',
      name: 'Karan Malhotra',
      avatar: 'KM',
      university: 'DTU Delhi',
      location: 'Noida',
      role: 'Backend',
      score: 89,
      skills: ['Golang', 'Java', 'Spring Boot', 'MySQL', 'Kafka', 'gRPC', 'Docker'],
      scenarios: 9,
      rcaRating: 4.5,
      evidence: 6,
      availability: '60 days',
      email: 'karan.malhotra@dtu.ac.in',
      phone: '+91 32109 87654',
      linkedin: 'linkedin.com/in/karan-malhotra-backend',
      website: 'karanmalhotra.dev',
      summary: 'Backend developer focused on building secure Spring Boot services, real-time event-streaming pipelines via Apache Kafka, and modular microservice synchronization over gRPC.',
      education: {
        university: 'DTU Delhi',
        degree: 'B.Tech in Information Technology',
        year: 'Class of 2026'
      },
      processMap: ['Client HTTP', 'Spring Filter', 'Controller Mapper', 'Service Validation', 'Kafka Producer', 'Consumer Workers', 'MySQL Persistence'],
      reliabilityGuardrails: [
        'Enforced robust transaction isolation boundaries on high-value orders.',
        'Wrote custom Spring Boot health-indicators to expose thread deadlock statuses.',
        'Integrated automated sonar quality-gates blocking bad PRs.',
        'Configured retry buffers and dead-letter queues on critical Kafka topics.'
      ],
      rca: {
        title: 'Incident #402: Deadlock Outage in Inventory Update Consumer',
        cause: 'Concurrent consumer threads updated the same inventory rows in reverse sequences, generating nested deadlock states in MySQL.',
        fix: 'Enforced strict ordered sorting on row-level record locks inside updates, resolving lock cycles.',
        rating: 4.6
      },
      memo: {
        title: 'RFC-062: Transitioning to gRPC for Internal pod sync',
        summary: 'Proposes substituting slow JSON HTTP internal pod messaging with binary gRPC protocols, slashing inter-service serialization limits.',
        link: 'https://docs.google.com/document/d/1k-062-grpc/edit'
      },
      aiUsage: {
        tools: ['GitHub Copilot'],
        bullets: [
          'Used Copilot to auto-complete boiler-plate Spring Boot Java configurations.',
          'Employed AI autocomplete to quickly parse NMEA diagnostic streams.',
          'Subjected all code outputs to strict unit-test suites with negative bounds.'
        ]
      },
      experience: [
        {
          title: 'Software Developer Intern',
          company: 'Paytm Payments Group',
          dates: 'Jan 2025 - Apr 2025',
          bullets: [
            'Collaborated in migrating the core rewards service to high-speed Spring Boot APIs.',
            'Optimized relational database indices, reducing load latency in query paths by 15%.',
            'Maintained clean log trace flows via Jaeger tracing.'
          ]
        }
      ],
      mentorReviews: [
        {
          project: 'Event Broker Transaction Handlers',
          description: 'Designed secure, auto-recovering consumer pipelines passing rigorous load testing benchmarks.',
          reviewer: 'Sarah Vance (Staff Engineer, Google)',
          rating: 4.5
        }
      ],
      certifications: [
        'Oracle Certified Professional: Java SE Programmer',
        'Confluent Certified Developer for Apache Kafka'
      ]
    },
    {
      id: 'cand-08',
      name: 'Ananya Iyer',
      avatar: 'AI',
      university: 'RVCE Bengaluru',
      location: 'Bengaluru',
      role: 'DevOps',
      score: 93,
      skills: ['AWS', 'Kubernetes', 'Ansible', 'Jenkins', 'Terraform', 'Grafana', 'ELK Stack'],
      scenarios: 11,
      rcaRating: 4.7,
      evidence: 8,
      availability: '30 days',
      email: 'ananya.iyer@rvce.edu.in',
      phone: '+91 21098 76543',
      linkedin: 'linkedin.com/in/ananya-iyer-sre',
      website: 'ananyaiyer.cloud',
      summary: 'Site Reliability Engineer with deep expertise in optimizing resource limits in EKS, scripting idempotent configuration steps via Ansible, and assembling unified telemetry views.',
      education: {
        university: 'RVCE Bengaluru',
        degree: 'B.E. in Computer Science',
        year: 'Class of 2026'
      },
      processMap: ['User load spike', 'CloudWatch Metric', 'HPA Scale-out', 'Pod launch', 'Config Init', 'Prometheus Scrape', 'Grafana Display'],
      reliabilityGuardrails: [
        'Enforced limits and requests configurations on all Kubernetes deployment namespaces.',
        'Wrote robust idempotency checks in all server configuration Ansible scripts.',
        'Structured automated daily backup routines for PostgreSQL snapshots.',
        'Configured PagerDuty alert pathways with escalations on database outage logs.'
      ],
      rca: {
        title: 'Incident #810: Outage in E-Commerce Cart via Redis Thread Block',
        cause: 'Exceeded connection thresholds on Redis nodes due to a sudden microservice replica scale-up operation lacking connection-pooling caps.',
        fix: 'Configured robust cluster pool restraints in cart service deployments and tuned eviction parameters.',
        rating: 4.8
      },
      memo: {
        title: 'RFC-094: Dynamic Horizontal Pod Autoscaling via Prometheus',
        summary: 'Proposes adopting custom metrics adapters (KEDA) to enable pod scaling based on real-time HTTP queue backlogs rather than bare CPU cycles.',
        link: 'https://docs.google.com/document/d/1a-094-keda/edit'
      },
      aiUsage: {
        tools: ['Cursor', 'GitHub Copilot'],
        bullets: [
          'Used Cursor to generate Grafana dashboard configurations and custom alert queries.',
          'Leveraged Copilot to compose bash scripts and build variables blocks.',
          'Tested all configuration commands on sandboxed local Kubernetes clusters.'
        ]
      },
      experience: [
        {
          title: 'Site Reliability Intern',
          company: 'Flipkart Operations R&D',
          dates: 'May 2025 - Jul 2025',
          bullets: [
            'Assembled unified cohort dashboards logging core latency metrics.',
            'Assisted in configuring EKS autoscaling templates matching seasonal traffic waves.',
            'Documented operational SOPs for database recovery flows.'
          ]
        }
      ],
      mentorReviews: [
        {
          project: 'Telemetry Display Platform',
          description: 'Constructed comprehensive cluster alert configurations receiving high marks for thoroughness.',
          reviewer: 'Alex Carter (Lead Coach, Stripe)',
          rating: 4.7
        }
      ],
      certifications: [
        'Certified Kubernetes Administrator (CKA)',
        'AWS Certified DevOps Engineer – Professional'
      ]
    }
  ];

  // Search and Filter candidate selection logic
  const filteredCandidates = candidates.filter(cand => {
    // 1. Domain/Track filter
    if (domainFilter !== 'All tracks') {
      if (cand.role.toLowerCase() !== domainFilter.toLowerCase()) {
        return false;
      }
    }

    // 2. Experience level / score ranges
    if (experienceFilter !== 'Any') {
      // Foundational: < 80 score
      // Developing: 80 - 85 score
      // Competent: 86 - 90 score
      // Job-ready: > 90 score
      if (experienceFilter === 'Foundational' && cand.score >= 80) return false;
      if (experienceFilter === 'Developing' && (cand.score < 80 || cand.score > 85)) return false;
      if (experienceFilter === 'Competent' && (cand.score < 86 || cand.score > 90)) return false;
      if (experienceFilter === 'Job-ready' && cand.score <= 90) return false;
    }

    // 3. Debounced search query
    if (debouncedQuery.trim() !== '') {
      const q = debouncedQuery.toLowerCase();
      const matchesName = cand.name.toLowerCase().includes(q);
      const matchesUniv = cand.university.toLowerCase().includes(q);
      const matchesSkill = cand.skills.some(skill => skill.toLowerCase().includes(q));
      return matchesName || matchesUniv || matchesSkill;
    }

    return true;
  });

  // Check if we render the empty state
  const isEmptyState = searchQuery.trim() === '' && domainFilter === 'All tracks' && experienceFilter === 'Any';

  const handleOpenPanel = (cand) => {
    setSelectedCandidate(cand);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedCandidate(null);
  };

  return (
    <div className="employer-workspace">
      {/* 1. Sidebar Navigation */}
      <div className="employer-sidebar">
        <div className="employer-sidebar-brand" onClick={() => onNavigate('landing')}>
          <div className="employer-brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span>WorkReady AI</span>
        </div>

        <div className="employer-sidebar-header">PORTAL ACCESS</div>

        <nav className="employer-sidebar-nav">
          <button className="employer-nav-btn active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="employer-nav-icon" width="20" height="20">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            <span>Talent Search</span>
          </button>
        </nav>

        <div className="employer-sidebar-footer">
          <div className="employer-user-card">
            <div className="employer-avatar">EP</div>
            <div className="employer-user-info">
              <span className="employer-user-name">Guest Recruiter</span>
              <span className="employer-user-role">Public Preview</span>
            </div>
          </div>
          <button className="employer-logout-btn" onClick={() => onNavigate('landing')}>
            Back to Home
          </button>
        </div>
      </div>

      {/* Main Panel */}
      <div className="employer-main-panel">
        
        {/* Header Section */}
        <header className="employer-header">
          <div className="employer-header-title-box">
            <h1 className="employer-page-title">Find work-ready engineering talent</h1>
            <p className="employer-page-subtitle">Search verified graduates with mentor-reviewed evidence portfolios.</p>
          </div>
        </header>

        <main className="employer-content">
          {/* 2. Search Component & Filters */}
          <div className="employer-search-filter-section">
            <div className="employer-search-bar-container">
              <svg className="employer-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, university, or skill (e.g. Kubernetes)"
                className="employer-search-input-field"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="employer-clear-search-btn" onClick={() => setSearchQuery('')}>
                  ✕
                </button>
              )}
            </div>

            <div className="employer-filters-container">
              <div className="employer-filter-dropdown-wrapper">
                <select
                  className="employer-filter-dropdown"
                  value={domainFilter}
                  onChange={(e) => setDomainFilter(e.target.value)}
                >
                  <option value="All tracks">All tracks</option>
                  <option value="Backend">Backend</option>
                  <option value="Frontend">Frontend</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Security">Security</option>
                  <option value="Fullstack">Fullstack</option>
                  <option value="AI / Data">AI / Data</option>
                </select>
              </div>

              <div className="employer-filter-dropdown-wrapper">
                <select
                  className="employer-filter-dropdown"
                  value={experienceFilter}
                  onChange={(e) => setExperienceFilter(e.target.value)}
                >
                  <option value="Any">Any Level</option>
                  <option value="Job-ready">Job-ready (&gt;90)</option>
                  <option value="Competent">Competent (86-90)</option>
                  <option value="Developing">Developing (80-85)</option>
                  <option value="Foundational">Foundational (&lt;80)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {isEmptyState ? (
            <div className="employer-empty-state-card">
              <div className="employer-empty-state-inner">
                <svg className="employer-empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <path d="M8 11h6" />
                </svg>
                <h3>Refine your search parameters</h3>
                <p>Enter a search term or apply a filter to view candidates.</p>
                <div className="employer-empty-state-quick-keywords">
                  <span>Try:</span>
                  <button onClick={() => setSearchQuery('Kubernetes')}>Kubernetes</button>
                  <button onClick={() => setSearchQuery('React')}>React</button>
                  <button onClick={() => setDomainFilter('Backend')}>Backend Track</button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* 3. Search Results Header */}
              <div className="employer-results-header">
                <div className="employer-results-summary">
                  Showing <strong>{filteredCandidates.length}</strong> of <strong>{candidates.length}</strong> candidates
                </div>
                <div className="employer-results-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14" className="badge-check-icon">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span>Verified portfolios</span>
                </div>
              </div>

              {/* Grid Layout */}
              {filteredCandidates.length === 0 ? (
                <div className="employer-no-results-card">
                  <p>No candidates match your current search query <strong>"{debouncedQuery}"</strong>.</p>
                  <button className="employer-reset-btn" onClick={() => { setSearchQuery(''); setDomainFilter('All tracks'); setExperienceFilter('Any'); }}>
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="employer-candidate-grid">
                  {filteredCandidates.map((cand) => (
                    /* 4. Candidate Card Anatomy */
                    <div key={cand.id} className="employer-candidate-card" onClick={() => handleOpenPanel(cand)}>
                      
                      {/* Top Row (Profile Summary) */}
                      <div className="card-top-row">
                        <div className="avatar-circle">
                          {cand.avatar}
                        </div>
                        <div className="identity-box">
                          <h3 className="name">{cand.name}</h3>
                          <div className="univ-line">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13" className="cap-icon">
                              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                              <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                            </svg>
                            <span>{cand.university}</span>
                          </div>
                          <div className="role-line">{cand.location} · {cand.role}</div>
                        </div>
                        <div className="score-badge" title="WorkReady score">
                          <span className="label">WR</span>
                          <span className="num">{cand.score}</span>
                        </div>
                      </div>

                      {/* Middle Row (Skills) */}
                      <div className="card-middle-row">
                        <div className="skills-pill-wrap">
                          {cand.skills.slice(0, 4).map((skill, idx) => (
                            <span key={idx} className="skill-pill">{skill}</span>
                          ))}
                          {cand.skills.length > 4 && (
                            <span className="skill-pill-more">+{cand.skills.length - 4}</span>
                          )}
                        </div>
                      </div>

                      {/* Data Row (Metrics) */}
                      <div className="card-data-row">
                        <div className="metric-col">
                          <span className="label">Scenarios</span>
                          <span className="value">{cand.scenarios}</span>
                        </div>
                        <div className="metric-col border-x">
                          <span className="label">RCA</span>
                          <span className="value">{cand.rcaRating} <span className="star-icon">★</span></span>
                        </div>
                        <div className="metric-col">
                          <span className="label">Evidence</span>
                          <span className="value">{cand.evidence}</span>
                        </div>
                      </div>

                      {/* Bottom Row (Availability & Action) */}
                      <div className="card-bottom-row">
                        <span className={`availability-badge avail-${cand.availability.toLowerCase().replace(' ', '-')}`}>
                          {cand.availability === 'Immediate' ? 'Immediate availability' : `Available in ${cand.availability}`}
                        </span>
                        <button className="view-portfolio-btn" onClick={(e) => { e.stopPropagation(); handleOpenPanel(cand); }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13" className="eye-icon">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          <span>View</span>
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* 5. Candidate Detail Panel (Slide-out Modal) */}
      {isPanelOpen && selectedCandidate && (
        <div className="modal-backdrop-overlay" onClick={handleClosePanel}>
          <div className="slideout-detail-panel" onClick={(e) => e.stopPropagation()}>
            
            {/* Header Close button */}
            <button className="panel-close-btn" onClick={handleClosePanel} aria-label="Close panel">
              ✕
            </button>

            {/* Panel Content wrapper (Scrollable) */}
            <div className="panel-scroll-content">
              
              {/* Header Box */}
              <div className="panel-detail-header">
                <div className="header-info-left">
                  <h2 className="detail-candidate-name">{selectedCandidate.name}</h2>
                  <p className="detail-candidate-subtitle">
                    {selectedCandidate.role} Engineer · Available {selectedCandidate.availability.toLowerCase() === 'immediate' ? 'immediately' : `in ${selectedCandidate.availability}`}
                  </p>
                </div>
                
                <div className="header-scores-right">
                  <div className="panel-results-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12" className="badge-check-icon">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span>Verified portfolio</span>
                  </div>
                  <div className="panel-wr-score-display">
                    <span className="lbl">WR SCORE</span>
                    <span className="val">{selectedCandidate.score}</span>
                  </div>
                </div>
              </div>

              {/* Grid of contact details */}
              <div className="panel-contact-grid">
                <div className="contact-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" className="contact-icon">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <span>{selectedCandidate.email}</span>
                </div>
                <div className="contact-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" className="contact-icon">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>{selectedCandidate.phone}</span>
                </div>
                <div className="contact-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" className="contact-icon">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>{selectedCandidate.location}, India</span>
                </div>
                <div className="contact-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" className="contact-icon">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                  <span className="link-text">{selectedCandidate.linkedin}</span>
                </div>
                <div className="contact-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" className="contact-icon">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  <span className="link-text">{selectedCandidate.website}</span>
                </div>
              </div>

              <hr className="panel-divider" />

              {/* Scrollable Body Sections */}
              <div className="panel-sections-container">
                
                {/* 1. Summary */}
                <section className="detail-section">
                  <h4 className="section-subheader">Summary</h4>
                  <p className="summary-paragraph">{selectedCandidate.summary}</p>
                </section>

                <hr className="panel-divider" />

                {/* 2. Education */}
                <section className="detail-section">
                  <h4 className="section-subheader">Education</h4>
                  <div className="education-row">
                    <div className="edu-left">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" className="edu-icon">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5-10 5z" />
                        <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                      </svg>
                      <div>
                        <div className="edu-univ font-medium">{selectedCandidate.education.university}</div>
                        <div className="edu-degree">{selectedCandidate.education.degree}</div>
                      </div>
                    </div>
                    <div className="edu-right-year">
                      {selectedCandidate.education.year}
                    </div>
                  </div>
                </section>

                <hr className="panel-divider" />

                {/* 3. Process Map */}
                <section className="detail-section">
                  <h4 className="section-subheader">Architectural Process Map</h4>
                  <div className="process-map-flow">
                    {selectedCandidate.processMap.map((step, idx) => (
                      <React.Fragment key={idx}>
                        <span className="flow-step-pill">{step}</span>
                        {idx < selectedCandidate.processMap.length - 1 && (
                          <span className="flow-arrow">➔</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </section>

                <hr className="panel-divider" />

                {/* 4. Safety / Quality */}
                <section className="detail-section">
                  <h4 className="section-subheader">Safety / Quality</h4>
                  <div className="guardrails-title font-medium">Reliability Guardrails</div>
                  <ul className="guardrails-list">
                    {selectedCandidate.reliabilityGuardrails.map((g, idx) => (
                      <li key={idx}>
                        <span className="bullet">●</span>
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <hr className="panel-divider" />

                {/* 5. Root Cause Analysis */}
                <section className="detail-section">
                  <h4 className="section-subheader">Root Cause Analysis (RCA)</h4>
                  <div className="bordered-card border-purple-glow">
                    <div className="card-header-row">
                      <h5 className="card-title font-medium">{selectedCandidate.rca.title}</h5>
                      <span className="card-rating-pill">{selectedCandidate.rca.rating} ★</span>
                    </div>
                    <div className="card-block">
                      <strong>Root cause:</strong>
                      <p>{selectedCandidate.rca.cause}</p>
                    </div>
                    <div className="card-block">
                      <strong>Fix:</strong>
                      <p>{selectedCandidate.rca.fix}</p>
                    </div>
                  </div>
                </section>

                <hr className="panel-divider" />

                {/* 6. Technical Memo */}
                <section className="detail-section">
                  <h4 className="section-subheader">Technical Memo</h4>
                  <div className="bordered-card">
                    <div className="memo-title-row">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" className="doc-icon">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      <h5 className="memo-title font-medium">{selectedCandidate.memo.title}</h5>
                    </div>
                    <p className="memo-summary">{selectedCandidate.memo.summary}</p>
                    <a href={selectedCandidate.memo.link} onClick={(e) => { e.preventDefault(); alert(`Opening document link: ${selectedCandidate.memo.link}`); }} className="memo-link">
                      View full technical RFC layout ➔
                    </a>
                  </div>
                </section>

                <hr className="panel-divider" />

                {/* 7. AI Usage */}
                <section className="detail-section">
                  <h4 className="section-subheader">AI Co-Pilot Integration</h4>
                  <div className="ai-tools-row">
                    {selectedCandidate.aiUsage.tools.map((t, idx) => (
                      <span key={idx} className="ai-tool-pill">{t}</span>
                    ))}
                  </div>
                  <ul className="ai-bullets-list">
                    {selectedCandidate.aiUsage.bullets.map((b, idx) => (
                      <li key={idx}>
                        <span className="bullet">●</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <hr className="panel-divider" />

                {/* 8. Experience */}
                <section className="detail-section">
                  <h4 className="section-subheader">Work Experience</h4>
                  <div className="experience-list">
                    {selectedCandidate.experience.map((exp, idx) => (
                      <div key={idx} className="experience-item">
                        <div className="exp-title-row">
                          <div>
                            <span className="exp-title font-medium">{exp.title}</span>
                            <span className="exp-company"> · {exp.company}</span>
                          </div>
                          <span className="exp-dates">{exp.dates}</span>
                        </div>
                        <ul className="exp-bullets">
                          {exp.bullets.map((b, bIdx) => (
                            <li key={bIdx}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>

                <hr className="panel-divider" />

                {/* 9. Mentor-Reviewed Evidence */}
                <section className="detail-section">
                  <h4 className="section-subheader">Mentor-Reviewed Evidence</h4>
                  <div className="evidence-cards-list">
                    {selectedCandidate.mentorReviews.map((rev, idx) => (
                      <div key={idx} className="bordered-card border-blue-glow">
                        <div className="evidence-hdr-row">
                          <h5 className="evidence-project font-medium">{rev.project}</h5>
                          <span className="evidence-rating">{rev.rating} ★</span>
                        </div>
                        <p className="evidence-desc">{rev.description}</p>
                        <div className="evidence-reviewer">Reviewed by <strong>{rev.reviewer}</strong></div>
                      </div>
                    ))}
                  </div>

                  <div className="evidence-metrics-summary-block">
                    <h5 className="summary-title font-medium">Aggregate Simulator Performance</h5>
                    <div className="metrics-summary-row">
                      <div className="metric-box">
                        <span className="lbl">Total Scenarios</span>
                        <span className="val">{selectedCandidate.scenarios}</span>
                      </div>
                      <div className="metric-box">
                        <span className="lbl">RCA Star Rating</span>
                        <span className="val">{selectedCandidate.rcaRating} ★</span>
                      </div>
                      <div className="metric-box">
                        <span className="lbl">Verified Evidence</span>
                        <span className="val">{selectedCandidate.evidence}</span>
                      </div>
                    </div>
                  </div>
                </section>

                <hr className="panel-divider" />

                {/* 10. Skills */}
                <section className="detail-section">
                  <h4 className="section-subheader">Technical Skills</h4>
                  <div className="skills-pill-wrap">
                    {selectedCandidate.skills.map((skill, idx) => (
                      <span key={idx} className="skill-pill large">{skill}</span>
                    ))}
                  </div>
                </section>

                <hr className="panel-divider" />

                {/* 11. Certifications */}
                <section className="detail-section">
                  <h4 className="section-subheader">Certifications & Badges</h4>
                  <div className="certifications-list">
                    {selectedCandidate.certifications.map((cert, idx) => (
                      <div key={idx} className="cert-row">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" className="award-ribbon-icon">
                          <circle cx="12" cy="8" r="7" />
                          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                        </svg>
                        <span>{cert}</span>
                      </div>
                    ))}
                  </div>
                </section>

              </div>

            </div>

            {/* Sticky Footer */}
            <div className="panel-detail-footer">
              <span className={`availability-badge avail-${selectedCandidate.availability.toLowerCase().replace(' ', '-')}`}>
                {selectedCandidate.availability === 'Immediate' ? 'Immediate availability' : `Available in ${selectedCandidate.availability}`}
              </span>
              
              <button className="panel-contact-button" onClick={() => alert(`Contacting ${selectedCandidate.name} via recruiter dashboard integration...`)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14" className="envelope-icon">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span>Contact Candidate</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
