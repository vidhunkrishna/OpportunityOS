/**
 * Preparation Roadmap Generator Service
 * Generates personalized 7-day preparation plans tailored to missing required & preferred skills.
 */

export function generatePersonalizedRoadmap(opportunity, skillGap) {
  const missingReq = skillGap.missingRequired || [];
  const missingPref = skillGap.missingPreferred || [];

  const primarySkill = missingReq[0] || missingPref[0] || 'Technical Project Polish';
  const secondarySkill = missingPref[0] || 'Cloud Deployment';

  const defaultTasks = [
    {
      day: 1,
      title: `${primarySkill} Fundamentals & Environment Setup`,
      description: `Learn core concepts of ${primarySkill}, CLI tooling, and complete basic hands-on setup.`,
      duration: '2 hours',
      priority: 'HIGH'
    },
    {
      day: 2,
      title: `Containerize / Build with ${primarySkill}`,
      description: `Take your existing project (e.g. E-commerce REST API) and integrate ${primarySkill}.`,
      duration: '3 hours',
      priority: 'HIGH'
    },
    {
      day: 3,
      title: `Advanced Configuration & Multi-container Setup`,
      description: `Configure environment variables, network bridges, and local orchestration for ${primarySkill}.`,
      duration: '2.5 hours',
      priority: 'HIGH'
    },
    {
      day: 4,
      title: `Testing & Debugging ${primarySkill} Workflow`,
      description: `Run full integration tests against your containerized services and resolve edge cases.`,
      duration: '2 hours',
      priority: 'MEDIUM'
    },
    {
      day: 5,
      title: `${secondarySkill} Basics & Cloud Overview`,
      description: `Understand ${secondarySkill} essentials and how it connects with your ${primarySkill} workflow.`,
      duration: '2 hours',
      priority: 'MEDIUM'
    },
    {
      day: 6,
      title: `Documentation & Portfolio Project Showcase`,
      description: `Write a clean README, record a 1-minute demo video, and push code to GitHub.`,
      duration: '1.5 hours',
      priority: 'MEDIUM'
    },
    {
      day: 7,
      title: `${opportunity.organization} Application Submission`,
      description: `Tailor your resume bullets to highlight ${primarySkill} and submit your application for ${opportunity.title}.`,
      duration: '1 hour',
      priority: 'HIGH'
    }
  ];

  return {
    title: `7-Day ${opportunity.title} Preparation Plan`,
    targetSkills: [...missingReq, ...missingPref],
    tasks: defaultTasks
  };
}
