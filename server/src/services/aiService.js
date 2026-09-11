/**
 * OpportunityOS AI Assistant Service
 * Integrates Google Gemini AI API (gemini-2.5-flash / gemini-1.5-flash) for contextual career guidance.
 * Falls back seamlessly to a rich local knowledge generator if GEMINI_API_KEY is not set or API fails.
 */

const TECH_EXPLANATIONS = {
  docker: `### 🐳 What is Docker? (Containerization Engine)

**Docker** is a containerization platform that packages software applications along with all their dependencies, runtime environments, and configuration files into lightweight, portable units called **containers**.

#### 🔑 Core Concepts to Understand:
- 📦 **Containers**: Isolated execution environments that guarantee code runs identically across dev, testing, and production (*"Works on my machine"* solution).
- 📄 **Dockerfile**: A script containing commands to build a Docker container image step-by-step.
- 🖼 **Docker Image**: A read-only blueprint used to instantiate running containers.
- 🚀 **Docker Compose**: Tool for orchestration of multi-container microservices (e.g., React Frontend + Node Backend + Database).

#### 🎯 Why Top Companies Require Docker:
Modern Full Stack & Cloud teams rely on Docker to build scalable microservices and automate CI/CD deployment pipelines. Learning Docker boosts your career readiness for Software Engineer roles!`,

  aws: `### ☁️ What is Amazon Web Services (AWS)?

**AWS** is the world's leading cloud computing platform, offering scalable infrastructure services including virtual server hosting, cloud databases, file storage, and serverless compute.

#### 🔑 Key Services for Web Developers:
- 🖥 **EC2 (Elastic Compute Cloud)**: Virtual servers for hosting web apps.
- 🗄 **S3 (Simple Storage Service)**: Object storage for uploading images, files, and assets.
- ⚡ **Lambda**: Serverless functions triggered by HTTP events.
- 🛢 **RDS (Relational Database Service)**: Managed PostgreSQL & MySQL database instances.

#### 🎯 Career Impact:
Familiarity with AWS demonstrates cloud readiness and system deployment experience to technical recruiters.`,

  react: `### ⚛️ What is React.js?

**React** is a popular JavaScript library developed by Meta for building dynamic, high-performance User Interfaces (UIs) using reusable component architecture.

#### 🔑 Key Features:
- 🧩 **Component Architecture**: Modular UI blocks (e.g., Navbar, Cards, Buttons).
- ⚡ **Virtual DOM**: Ultra-fast UI rendering by diffing changes in memory before updating the real DOM.
- 🔄 **State & Hooks**: Dynamic data management using hooks like \`useState\`, \`useEffect\`, and \`useContext\`.`,

  node: `### 🟢 What is Node.js?

**Node.js** is an open-source, cross-platform JavaScript runtime engine built on Google Chrome's V8 engine that enables developers to build high-concurrency backend servers in JavaScript.

#### 🔑 Key Advantages:
- ⚡ **Non-blocking I/O**: Asynchronous event loop capable of handling thousands of concurrent HTTP API connections.
- 📦 **NPM Ecosystem**: Access to over 2 million open-source modules and packages.
- 🌐 **Full-Stack JavaScript**: Write both client-side and server-side code using a single programming language.`
};

export async function generateAIResponse(student, opportunity, prompt, matchData = null) {
  const apiKey = process.env.GEMINI_API_KEY;

  const studentName = student?.name || 'Student';
  const oppTitle = opportunity?.title || 'Target Opportunity';
  const org = opportunity?.organization || 'Organization';
  
  const missingReq = matchData?.skillGap?.missingRequired || [];
  const missingPref = matchData?.skillGap?.missingPreferred || [];
  const matchedSkills = matchData?.skillGap?.matchedRequired || 
    (typeof student?.skillsJson === 'string' ? JSON.parse(student.skillsJson || '[]') : (student?.skills || ['JavaScript', 'React']));
  
  const matchScore = matchData?.matchScore || 90;
  const currentReadiness = matchData?.readiness?.currentReadiness || 90;
  const potentialReadiness = matchData?.readiness?.potentialReadiness || 95;
  
  const studentGoal = JSON.parse(student?.careerGoalsJson || '[]')[0] || student?.careerGoals?.[0] || 'Software Engineer';
  const studentBranch = student?.branch || 'Computer Science';
  const studentYear = student?.academicYear || 3;

  // 1. Try Google Gemini API if a valid key is provided
  if (apiKey && apiKey.trim().length > 0 && apiKey !== 'YOUR_GEMINI_API_KEY' && apiKey.startsWith('AIzaSy')) {
    try {
      const systemContext = `You are OpportunityOS AI, an expert career advisor assistant for students.
Student: ${studentName} (${studentBranch}, Year ${studentYear})
Target Goal: ${studentGoal}
Verified Skills: ${matchedSkills.join(', ')}

Selected Opportunity: ${oppTitle} (${org})
Match Score: ${matchScore}%, Readiness: ${currentReadiness}%
Missing Skills: ${missingReq.join(', ') || 'None'}

Instructions:
- Provide clear, actionable advice formatted in Markdown with bold headers and bullet points.
- Directly answer the user's question with technical depth and practical steps.`;

      const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash'];
      for (const model of modelsToTry) {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: `${systemContext}\n\nUser Question: ${prompt}` }]
                }
              ],
              generationConfig: { maxOutputTokens: 600, temperature: 0.7 }
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          const geminiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (geminiText) {
            console.log(`Successfully generated AI response using Google Gemini (${model})`);
            return geminiText.trim();
          }
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to local knowledge engine:', err?.message || err);
    }
  }

  // 2. Rich Local Knowledge Generator (Fallback Engine)
  const query = (prompt || '').toLowerCase();

  // Tech Concept Explanation Check
  for (const [key, explanation] of Object.entries(TECH_EXPLANATIONS)) {
    if (query.includes(key)) {
      return explanation;
    }
  }

  // Improvement / Preparation Query
  if (query.includes('improve') || query.includes('missing') || query.includes('prepare') || query.includes('readiness')) {
    if (missingReq.length > 0) {
      return `### 🎯 Readiness Action Plan for **${oppTitle}** at **${org}**\n\n` +
        `1. **Primary Focus**: Complete a 7-day preparation roadmap for **${missingReq[0]}**. Containerizing this skill will increase your readiness from **${currentReadiness}% to ${potentialReadiness}%**.\n` +
        `2. **Secondary Goal**: Explore **${missingPref[0] || 'AWS / Cloud tools'}** to stand out among top applicants.\n` +
        `3. **Action Item**: Click **'Generate 7-Day Action Plan'** on your dashboard to begin guided daily practice.`;
    } else {
      return `### 🌟 Full Skill Match for **${oppTitle}** at **${org}**\n\n` +
        `• Your profile satisfies all core required skills with **${currentReadiness}% Readiness**!\n` +
        `• **Recommended Step**: Review preferred skills like **${missingPref[0] || 'AWS'}** or submit your application directly via the opportunity link.`;
    }
  }

  // Why Match Query
  if (query.includes('why') || query.includes('match') || query.includes('score')) {
    return `### 📊 Match Breakdown for **${oppTitle}** (${matchScore}% Match)\n\n` +
      `• **Skill Fit**: Verified match in **${matchedSkills.join(', ')}**.\n` +
      `• **Career Alignment**: Your target goal of becoming a **${studentGoal}** directly matches this role.\n` +
      `• **Academic Standing**: ${studentBranch} (Year ${studentYear}) meets all eligibility criteria.`;
  }

  // Application Advice Query
  if (query.includes('apply') || query.includes('should i') || query.includes('competitive')) {
    return `### 🚀 Application Guidance for **${oppTitle}**\n\n` +
      `• **Current Readiness**: **${currentReadiness}%**.\n` +
      `• **Status**: ${missingReq.length === 0 ? 'Your profile is fully ready! Apply now.' : `Build readiness for **${missingReq[0]}** before applying to maximize match confidence.`}`;
  }

  // Default Helpful Response
  return `### 👋 Hello ${studentName}! (OpportunityOS Assistant)\n\n` +
    `I can help you analyze match scores, build 7-day preparation roadmaps, and explain technical skills for **${oppTitle}**.\n\n` +
    `• **Match Score**: **${matchScore}%** | **Readiness**: **${currentReadiness}%**\n` +
    `• **Status**: ${missingReq.length > 0 ? `Primary recommended focus is **${missingReq[0]}**.` : 'You satisfy all core required skills!'}\n\n` +
    `*Try asking me: "What is Docker?", "Why is this a good match?", or "How can I improve my score?"*`;
}

