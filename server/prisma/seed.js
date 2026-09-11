/**
 * OpportunityOS Seed Data Script
 * Seeds student profile and realistic opportunities with verified live URLs.
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function seedDatabase(force = false) {
  const oppCount = await prisma.opportunity.count().catch(() => 0);
  if (!force && oppCount > 0) {
    console.log(`Database already contains ${oppCount} opportunities. Skipping auto-seed.`);
    return;
  }

  console.log('Seeding OpportunityOS Database...');

  // Clean existing tables
  await prisma.preparationTask.deleteMany({}).catch(() => {});
  await prisma.preparationPlan.deleteMany({}).catch(() => {});
  await prisma.application.deleteMany({}).catch(() => {});
  await prisma.opportunity.deleteMany({}).catch(() => {});
  await prisma.student.deleteMany({}).catch(() => {});

  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create Student
  const student = await prisma.student.create({
    data: {
      name: 'Alex Sharma',
      email: 'alex.sharma@example.com',
      password: hashedPassword,
      role: 'STUDENT',
      education: 'B.Tech Computer Science',
      academicYear: 3,
      branch: 'Computer Science',
      skillsJson: JSON.stringify(['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'REST APIs', 'Git']),
      softSkillsJson: JSON.stringify(['Problem Solving', 'Teamwork', 'Communication']),
      projectsJson: JSON.stringify([
        {
          title: 'E-commerce Web Application',
          description: 'Full-stack React & Node.js web application featuring RESTful API design, state management, and cart processing.',
          technologies: ['React', 'Node.js', 'JavaScript', 'REST APIs']
        },
        {
          title: 'Student Management System',
          description: 'Backend portal built with Node.js and Express to manage student enrollment records and grade statistics.',
          technologies: ['Node.js', 'JavaScript', 'Express']
        }
      ]),
      experienceJson: JSON.stringify([
        {
          role: 'Frontend Developer Intern',
          company: 'Campus Tech Club',
          description: 'Built interactive React components and improved page loading performance by 25%.'
        }
      ]),
      interestsJson: JSON.stringify(['Web Development', 'AI', 'Hackathons']),
      preferredDomainsJson: JSON.stringify(['Full Stack', 'Frontend', 'Backend']),
      careerGoalsJson: JSON.stringify(['Full Stack Developer']),
      preferredLocationsJson: JSON.stringify(['Remote', 'Bangalore']),
      preferredOppTypesJson: JSON.stringify(['Internship', 'Hackathon', 'Fellowship'])
    }
  });

  console.log(`Created Student: ${student.name} (${student.id})`);

  // 1b. Create Admin Account
  const adminUser = await prisma.student.create({
    data: {
      name: 'OpportunityOS Admin',
      email: 'admin@opportunityos.com',
      password: hashedPassword,
      role: 'ADMIN',
      education: 'M.Tech Software Engineering',
      academicYear: 4,
      branch: 'Software Engineering',
      skillsJson: JSON.stringify(['System Architecture', 'Node.js', 'React', 'Database Admin']),
      softSkillsJson: JSON.stringify(['Leadership', 'Product Management']),
      projectsJson: JSON.stringify([]),
      experienceJson: JSON.stringify([]),
      interestsJson: JSON.stringify(['Platform Management']),
      preferredDomainsJson: JSON.stringify(['Administration']),
      careerGoalsJson: JSON.stringify(['System Administrator']),
      preferredLocationsJson: JSON.stringify(['Remote']),
      preferredOppTypesJson: JSON.stringify(['Full Time'])
    }
  });

  console.log(`Created Admin User: ${adminUser.name} (${adminUser.id})`);

  // Future dates helper
  const daysFromNow = (d) => new Date(Date.now() + d * 24 * 60 * 60 * 1000);

  // 2. Seed 20+ Realistic Opportunities with Real Live URLs
  const opportunitiesData = [
    {
      title: 'Full Stack Developer Intern',
      organization: 'TechNova',
      category: 'Internship',
      description: 'Join TechNova as a Full Stack Developer Intern! Work directly with senior engineers building responsive React frontends, robust Node.js microservices, and containerized backend architectures.',
      eligibilityJson: JSON.stringify({ minYear: 3, maxYear: 4, branches: ['Computer Science', 'Information Technology', 'Software Engineering'], academicLevel: 'Undergraduate' }),
      requiredSkillsJson: JSON.stringify(['JavaScript', 'React', 'Node.js', 'REST APIs', 'Docker']),
      preferredSkillsJson: JSON.stringify(['AWS', 'TypeScript']),
      deadline: daysFromNow(3),
      location: 'Bangalore / Remote',
      mode: 'Remote',
      experienceRequirements: '1+ full-stack web project',
      educationRequirements: 'B.Tech / B.E in CS / IT (3rd or 4th Year)',
      applicationUrl: 'https://careers.google.com/jobs/results/?q=software%20engineering%20intern',
      tagsJson: JSON.stringify(['Full Stack', 'Web Development', 'React', 'Node.js', 'Remote']),
      source: 'TechNova Careers',
      lastUpdated: '2 days ago',
      isVerified: true
    },
    {
      title: 'Backend Engineering Intern',
      organization: 'CloudScale Systems',
      category: 'Internship',
      description: 'Build high-throughput REST APIs and microservice architecture in Node.js and Express.',
      eligibilityJson: JSON.stringify({ minYear: 2, maxYear: 4, branches: ['Computer Science', 'IT'], academicLevel: 'Undergraduate' }),
      requiredSkillsJson: JSON.stringify(['Node.js', 'JavaScript', 'REST APIs', 'SQL']),
      preferredSkillsJson: JSON.stringify(['Docker', 'Redis']),
      deadline: daysFromNow(5),
      location: 'Bangalore',
      mode: 'Hybrid',
      experienceRequirements: 'Backend REST API project',
      educationRequirements: 'B.Tech CS/IT',
      applicationUrl: 'https://www.linkedin.com/jobs/search/?keywords=Backend%20Engineer%20Intern',
      tagsJson: JSON.stringify(['Backend', 'Node.js', 'API']),
      source: 'CloudScale Portal',
      lastUpdated: '1 day ago',
      isVerified: true
    },
    {
      title: 'National AI & Web Innovation Hackathon',
      organization: 'InnovateX India',
      category: 'Hackathon',
      description: '36-hour hackathon building AI-enhanced web platforms for student career growth.',
      eligibilityJson: JSON.stringify({ minYear: 1, maxYear: 4, branches: ['all'], academicLevel: 'Undergraduate' }),
      requiredSkillsJson: JSON.stringify(['JavaScript', 'React', 'Node.js']),
      preferredSkillsJson: JSON.stringify(['Python', 'AI']),
      deadline: daysFromNow(4),
      location: 'Online',
      mode: 'Remote',
      experienceRequirements: 'None',
      educationRequirements: 'Open to all enrolled students',
      applicationUrl: 'https://devpost.com/hackathons',
      tagsJson: JSON.stringify(['Hackathon', 'AI', 'Web Development']),
      source: 'Devpost',
      lastUpdated: '3 days ago',
      isVerified: true
    },
    {
      title: 'Frontend React Engineer Intern',
      organization: 'UI Craft Studios',
      category: 'Internship',
      description: 'Craft sleek, modern UI components with React, Tailwind CSS, and Framer Motion.',
      eligibilityJson: JSON.stringify({ minYear: 2, maxYear: 4, branches: ['Computer Science', 'IT'], academicLevel: 'Undergraduate' }),
      requiredSkillsJson: JSON.stringify(['HTML', 'CSS', 'JavaScript', 'React']),
      preferredSkillsJson: JSON.stringify(['TypeScript', 'Framer Motion']),
      deadline: daysFromNow(9),
      location: 'Remote',
      mode: 'Remote',
      experienceRequirements: 'Portfolio of React apps',
      educationRequirements: 'B.Tech CS/IT/Design',
      applicationUrl: 'https://wellfound.com/jobs',
      tagsJson: JSON.stringify(['Frontend', 'React', 'UI/UX']),
      source: 'LinkedIn Jobs',
      lastUpdated: '1 day ago',
      isVerified: true
    },
    {
      title: 'Advanced AI Research Fellowship',
      organization: 'National AI Institute',
      category: 'Research',
      description: '6-month research fellowship for graduating final-year students focused on NLP and LLM alignment.',
      eligibilityJson: JSON.stringify({ minYear: 4, maxYear: 4, branches: ['Computer Science', 'AI'], academicLevel: 'Undergraduate' }),
      requiredSkillsJson: JSON.stringify(['Python', 'PyTorch', 'Machine Learning']),
      preferredSkillsJson: JSON.stringify(['NLP', 'Transformers']),
      deadline: daysFromNow(18),
      location: 'Hyderabad',
      mode: 'On-site',
      experienceRequirements: 'Prior research project or publication',
      educationRequirements: 'Final-year B.Tech students only',
      applicationUrl: 'https://openai.com/careers/search/',
      tagsJson: JSON.stringify(['Research', 'AI', 'Machine Learning']),
      source: 'College Placement Cell',
      lastUpdated: '4 days ago',
      isVerified: true
    },
    {
      title: 'Cloud Infrastructure Fellowship',
      organization: 'AWS Student Network',
      category: 'Fellowship',
      description: 'Learn cloud containerization, AWS Lambda, Docker, and DevOps automation.',
      eligibilityJson: JSON.stringify({ minYear: 2, maxYear: 4, branches: ['Computer Science', 'IT'], academicLevel: 'Undergraduate' }),
      requiredSkillsJson: JSON.stringify(['Git', 'Linux', 'Networking']),
      preferredSkillsJson: JSON.stringify(['Docker', 'AWS']),
      deadline: daysFromNow(12),
      location: 'Remote',
      mode: 'Remote',
      experienceRequirements: 'Basic command line knowledge',
      educationRequirements: 'Enrolled B.Tech student',
      applicationUrl: 'https://aws.amazon.com/developer/community/students/',
      tagsJson: JSON.stringify(['Cloud', 'AWS', 'DevOps']),
      source: 'AWS Education',
      lastUpdated: '2 days ago',
      isVerified: true
    },
    {
      title: 'Cybersecurity Defense Challenge',
      organization: 'CyberShield Guard',
      category: 'Competition',
      description: 'CTF security competition testing web application vulnerability mitigation.',
      eligibilityJson: JSON.stringify({ minYear: 1, maxYear: 4, branches: ['all'], academicLevel: 'Undergraduate' }),
      requiredSkillsJson: JSON.stringify(['JavaScript', 'Networking', 'Security']),
      preferredSkillsJson: JSON.stringify(['Python', 'Linux']),
      deadline: daysFromNow(8),
      location: 'Online',
      mode: 'Remote',
      experienceRequirements: 'Basic web security awareness',
      educationRequirements: 'All undergraduate students',
      applicationUrl: 'https://hackerone.com/hacktivity',
      tagsJson: JSON.stringify(['Cybersecurity', 'CTF', 'Competition']),
      source: 'Hackerearth',
      lastUpdated: '3 days ago',
      isVerified: true
    },
    {
      title: 'Open Source Web Developer Grant',
      organization: 'Open Tech Foundation',
      category: 'Scholarship',
      description: 'Stipend grant awarded to undergraduate students contributing to React ecosystem tools.',
      eligibilityJson: JSON.stringify({ minYear: 2, maxYear: 4, branches: ['Computer Science', 'IT'], academicLevel: 'Undergraduate' }),
      requiredSkillsJson: JSON.stringify(['JavaScript', 'React', 'Git']),
      preferredSkillsJson: JSON.stringify(['Node.js']),
      deadline: daysFromNow(15),
      location: 'Remote',
      mode: 'Remote',
      experienceRequirements: 'Open source pull requests',
      educationRequirements: 'B.Tech CS/IT',
      applicationUrl: 'https://github.com/topics/student-developer-pack',
      tagsJson: JSON.stringify(['Scholarship', 'Open Source', 'React']),
      source: 'OpenTech Portal',
      lastUpdated: '5 days ago',
      isVerified: true
    },
    {
      title: 'Data Science & Analytics Intern',
      organization: 'DataPulse Analytics',
      category: 'Internship',
      description: 'Analyze user engagement datasets and build automated dashboard visualizations.',
      eligibilityJson: JSON.stringify({ minYear: 3, maxYear: 4, branches: ['Computer Science', 'Data Science', 'Mathematics'], academicLevel: 'Undergraduate' }),
      requiredSkillsJson: JSON.stringify(['Python', 'SQL', 'Data Visualization']),
      preferredSkillsJson: JSON.stringify(['Pandas', 'Tableau']),
      deadline: daysFromNow(11),
      location: 'Pune / Remote',
      mode: 'Hybrid',
      experienceRequirements: 'SQL and Python project',
      educationRequirements: 'B.Tech 3rd/4th year',
      applicationUrl: 'https://www.linkedin.com/jobs/search/?keywords=Data%20Science%20Intern',
      tagsJson: JSON.stringify(['Data Science', 'Python', 'Analytics']),
      source: 'Indeed',
      lastUpdated: '2 days ago',
      isVerified: true
    },
    {
      title: 'Mobile App Developer Competition',
      organization: 'AppNation Guild',
      category: 'Competition',
      description: 'Build cross-platform mobile apps for local community problem solving.',
      eligibilityJson: JSON.stringify({ minYear: 1, maxYear: 4, branches: ['all'], academicLevel: 'Undergraduate' }),
      requiredSkillsJson: JSON.stringify(['JavaScript', 'React']),
      preferredSkillsJson: JSON.stringify(['React Native', 'Flutter']),
      deadline: daysFromNow(6),
      location: 'Online',
      mode: 'Remote',
      experienceRequirements: 'Mobile app prototype',
      educationRequirements: 'Open to all students',
      applicationUrl: 'https://unstop.com/hackathons',
      tagsJson: JSON.stringify(['Mobile', 'React Native', 'Competition']),
      source: 'Unstop',
      lastUpdated: '1 day ago',
      isVerified: true
    },
    {
      title: 'DevOps & Systems Architecture Workshop',
      organization: 'SystemCraft Institute',
      category: 'Workshop',
      description: 'Hands-on certification workshop on Docker, Kubernetes, and CI/CD pipelines.',
      eligibilityJson: JSON.stringify({ minYear: 2, maxYear: 4, branches: ['Computer Science', 'IT'], academicLevel: 'Undergraduate' }),
      requiredSkillsJson: JSON.stringify(['Git', 'Linux']),
      preferredSkillsJson: JSON.stringify(['Docker']),
      deadline: daysFromNow(10),
      location: 'Online',
      mode: 'Remote',
      experienceRequirements: 'Basic command line skills',
      educationRequirements: 'All CS/IT students',
      applicationUrl: 'https://www.docker.com/products/docker-desktop/',
      tagsJson: JSON.stringify(['Workshop', 'Docker', 'DevOps']),
      source: 'SystemCraft',
      lastUpdated: '3 days ago',
      isVerified: true
    },
    {
      title: 'Junior Software Engineer (Full Time)',
      organization: 'Nexus Tech Solutions',
      category: 'Job',
      description: 'Full-time graduate placement opportunity for graduating final year engineers.',
      eligibilityJson: JSON.stringify({ minYear: 4, maxYear: 4, branches: ['Computer Science', 'IT', 'ECE'], academicLevel: 'Undergraduate' }),
      requiredSkillsJson: JSON.stringify(['JavaScript', 'Node.js', 'SQL', 'Git']),
      preferredSkillsJson: JSON.stringify(['React', 'Docker']),
      deadline: daysFromNow(21),
      location: 'Bangalore',
      mode: 'On-site',
      experienceRequirements: 'Internship or major project',
      educationRequirements: 'Final-year graduating students only',
      applicationUrl: 'https://careers.google.com/jobs/results/',
      tagsJson: JSON.stringify(['Job', 'Full Time', 'Node.js']),
      source: 'Placement Cell Portal',
      lastUpdated: '2 days ago',
      isVerified: true
    },
    {
      title: 'API Developer Hackathon',
      organization: 'Postman Community',
      category: 'Hackathon',
      description: 'Design and publish innovative public APIs using REST standards and Node.js.',
      eligibilityJson: JSON.stringify({ minYear: 1, maxYear: 4, branches: ['all'], academicLevel: 'Undergraduate' }),
      requiredSkillsJson: JSON.stringify(['JavaScript', 'Node.js', 'REST APIs']),
      preferredSkillsJson: JSON.stringify(['Express']),
      deadline: daysFromNow(7),
      location: 'Online',
      mode: 'Remote',
      experienceRequirements: 'REST API project',
      educationRequirements: 'All enrolled students',
      applicationUrl: 'https://www.postman.com/student-program/',
      tagsJson: JSON.stringify(['Hackathon', 'REST APIs', 'Node.js']),
      source: 'Postman Community',
      lastUpdated: '1 day ago',
      isVerified: true
    },
    {
      title: 'Web Security Certification Bootcamp',
      organization: 'SecureCode Academy',
      category: 'Certification',
      description: '4-week guided certification program in OWASP Top 10 and secure Node.js coding.',
      eligibilityJson: JSON.stringify({ minYear: 2, maxYear: 4, branches: ['Computer Science', 'IT'], academicLevel: 'Undergraduate' }),
      requiredSkillsJson: JSON.stringify(['JavaScript', 'Node.js']),
      preferredSkillsJson: JSON.stringify(['REST APIs']),
      deadline: daysFromNow(14),
      location: 'Online',
      mode: 'Remote',
      experienceRequirements: 'Web development basics',
      educationRequirements: 'CS/IT students',
      applicationUrl: 'https://owasp.org/www-project-top-ten/',
      tagsJson: JSON.stringify(['Certification', 'Security', 'Node.js']),
      source: 'SecureCode Portal',
      lastUpdated: '4 days ago',
      isVerified: true
    },
    {
      title: 'Full Stack Innovation Challenge',
      organization: 'TechGig Hackathon',
      category: 'Competition',
      description: 'Sprint competition building full-stack web applications for smart campus management.',
      eligibilityJson: JSON.stringify({ minYear: 2, maxYear: 4, branches: ['Computer Science', 'IT'], academicLevel: 'Undergraduate' }),
      requiredSkillsJson: JSON.stringify(['React', 'Node.js', 'JavaScript']),
      preferredSkillsJson: JSON.stringify(['REST APIs', 'Docker']),
      deadline: daysFromNow(5),
      location: 'Online',
      mode: 'Remote',
      experienceRequirements: 'Full stack project',
      educationRequirements: 'Undergraduate students',
      applicationUrl: 'https://www.techgig.com/hackathon',
      tagsJson: JSON.stringify(['Competition', 'Full Stack', 'React']),
      source: 'TechGig',
      lastUpdated: '2 days ago',
      isVerified: true
    },
    {
      title: 'Women in Tech Leadership Scholarship',
      organization: 'Grace Hopper Network',
      category: 'Scholarship',
      description: 'Merit scholarship and mentorship program for female engineering undergraduates.',
      eligibilityJson: JSON.stringify({ minYear: 2, maxYear: 4, branches: ['all'], academicLevel: 'Undergraduate' }),
      requiredSkillsJson: JSON.stringify(['Problem Solving', 'Git']),
      preferredSkillsJson: JSON.stringify(['JavaScript', 'Python']),
      deadline: daysFromNow(25),
      location: 'Remote',
      mode: 'Remote',
      experienceRequirements: 'Academic record & project statement',
      educationRequirements: 'Enrolled female engineering students',
      applicationUrl: 'https://anitab.org/awards-grants/',
      tagsJson: JSON.stringify(['Scholarship', 'Diversity', 'Mentorship']),
      source: 'Grace Hopper Network',
      lastUpdated: '6 days ago',
      isVerified: true
    },
    {
      title: 'Generative AI Developer Sprint',
      organization: 'OpenAI Developer Group',
      category: 'Hackathon',
      description: 'Build creative web tools leveraging LLM APIs and modern React UI components.',
      eligibilityJson: JSON.stringify({ minYear: 1, maxYear: 4, branches: ['all'], academicLevel: 'Undergraduate' }),
      requiredSkillsJson: JSON.stringify(['JavaScript', 'React']),
      preferredSkillsJson: JSON.stringify(['Node.js', 'AI']),
      deadline: daysFromNow(9),
      location: 'Online',
      mode: 'Remote',
      experienceRequirements: 'React app experience',
      educationRequirements: 'Open to all students',
      applicationUrl: 'https://openai.com/careers/',
      tagsJson: JSON.stringify(['Hackathon', 'AI', 'React']),
      source: 'Dev Community',
      lastUpdated: '1 day ago',
      isVerified: true
    },
    {
      title: 'Backend Microservices Internship',
      organization: 'FinTech Pulse',
      category: 'Internship',
      description: 'Develop financial transaction REST services using Express, Node.js, and Redis caching.',
      eligibilityJson: JSON.stringify({ minYear: 3, maxYear: 4, branches: ['Computer Science', 'IT'], academicLevel: 'Undergraduate' }),
      requiredSkillsJson: JSON.stringify(['JavaScript', 'Node.js', 'REST APIs']),
      preferredSkillsJson: JSON.stringify(['Docker', 'SQL']),
      deadline: daysFromNow(8),
      location: 'Mumbai / Remote',
      mode: 'Hybrid',
      experienceRequirements: 'Backend API project',
      educationRequirements: '3rd or 4th Year B.Tech',
      applicationUrl: 'https://internshala.com/internships/full-stack-development-internship',
      tagsJson: JSON.stringify(['Internship', 'Backend', 'Node.js']),
      source: 'FinTech Pulse Careers',
      lastUpdated: '3 days ago',
      isVerified: true
    },
    {
      title: 'React & Frontend Architecture Fellowship',
      organization: 'Frontend Masters Guild',
      category: 'Fellowship',
      description: 'Mentorship program for mastering component architecture, state management, and web performance.',
      eligibilityJson: JSON.stringify({ minYear: 2, maxYear: 4, branches: ['Computer Science', 'IT'], academicLevel: 'Undergraduate' }),
      requiredSkillsJson: JSON.stringify(['HTML', 'CSS', 'JavaScript', 'React']),
      preferredSkillsJson: JSON.stringify(['Git']),
      deadline: daysFromNow(13),
      location: 'Remote',
      mode: 'Remote',
      experienceRequirements: 'React project',
      educationRequirements: 'Enrolled undergraduate',
      applicationUrl: 'https://frontendmasters.com/',
      tagsJson: JSON.stringify(['Fellowship', 'Frontend', 'React']),
      source: 'Frontend Masters',
      lastUpdated: '2 days ago',
      isVerified: true
    },
    {
      title: 'Global Student Code Competition',
      organization: 'ACM Student Chapter',
      category: 'Competition',
      description: 'Competitive programming and algorithmic problem solving contest for university teams.',
      eligibilityJson: JSON.stringify({ minYear: 1, maxYear: 4, branches: ['all'], academicLevel: 'Undergraduate' }),
      requiredSkillsJson: JSON.stringify(['JavaScript', 'Problem Solving']),
      preferredSkillsJson: JSON.stringify(['Git']),
      deadline: daysFromNow(16),
      location: 'Online',
      mode: 'Remote',
      experienceRequirements: 'Algorithm knowledge',
      educationRequirements: 'University students',
      applicationUrl: 'https://acm.org/student-members',
      tagsJson: JSON.stringify(['Competition', 'Algorithms', 'ACM']),
      source: 'ACM Portal',
      lastUpdated: '4 days ago',
      isVerified: true
    }
  ];

  for (const oppData of opportunitiesData) {
    const opp = await prisma.opportunity.create({ data: oppData });
    console.log(`Seeded Opportunity: ${opp.title} @ ${opp.organization}`);
  }

  // Pre-seed an initial Application status for Alex on TechNova
  const technovaOpp = await prisma.opportunity.findFirst({
    where: { title: 'Full Stack Developer Intern' }
  });

  if (technovaOpp) {
    await prisma.application.create({
      data: {
        studentId: student.id,
        opportunityId: technovaOpp.id,
        status: 'SAVED',
        notes: 'Target benchmark opportunity for Full Stack Developer role.'
      }
    });
    console.log('Seeded initial application state: TechNova -> SAVED');
  }

  console.log('OpportunityOS Database Seeding Completed Successfully!');
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('seed.js')) {
  seedDatabase(true)
    .catch((e) => {
      console.error('Seeding Error:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
