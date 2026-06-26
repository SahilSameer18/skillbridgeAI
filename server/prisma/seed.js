import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Each skill's `aliases` are literal, lowercase substrings expected to appear
 * inside Gemini's free-text skill gap (e.g. "Containerization (Docker/Kubernetes)").
 * Kept deliberately specific (tool/tech names, not broad concepts) so one skill's
 * alias never accidentally swallows a different tool's gap.
 *
 * Fill in every `url: "TODO"` with a real documentation link (DOCUMENTATION)
 * and a real YouTube video/playlist link (VIDEO) before running the seed.
 */
const skills = [
  // ---------- Languages ----------
  {
    name: "JavaScript",
    aliases: ["javascript", "ecmascript", "js"],
    resources: [
      {
        type: "DOCUMENTATION",
        title: "JavaScript Docs - MDN",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
      },
      {
        type: "VIDEO",
        title: "JavaScript Full Course - freeCodeCamp",
        url: "https://youtu.be/jS4aFq5-91M",
      },
    ],
  },
  {
    name: "TypeScript",
    aliases: ["typescript", "ts"],
    resources: [
      {
        type: "DOCUMENTATION",
        title: "TypeScript Handbook",
        url: "https://www.typescriptlang.org/docs/",
      },
      {
        type: "VIDEO",
        title: "TypeScript Full Course - freeCodeCamp",
        url: "https://www.youtube.com/watch?v=SpwzRDUQ1GI",
      },
    ],
  },
  {
    name: "Python",
    aliases: ["python"],
    resources: [
      {
        type: "DOCUMENTATION",
        title: "Python Official Docs",
        url: "https://docs.python.org/3/",
      },
      {
        type: "VIDEO",
        title: "Python Full Course - freeCodeCamp",
        url: "https://www.youtube.com/watch?v=rfscVS0vtbw",
      },
    ],
  },
  {
    name: "Java",
    aliases: ["java"],
    resources: [
      {
        type: "DOCUMENTATION",
        title: "Java Documentation - Oracle",
        url: "https://docs.oracle.com/en/java/",
      },
      {
        type: "VIDEO",
        title: "Java Full Course - freeCodeCamp",
        url: "https://youtu.be/A74TOX803D0",
      },
    ],
  },
  {
    name: "C++",
    aliases: ["c++", "cpp"],
    resources: [
      {
        type: "DOCUMENTATION",
        title: "C++ Reference",
        url: "https://en.cppreference.com/w/cpp",
      },
      {
        type: "VIDEO",
        title: "C++ Full Course - freeCodeCamp",
        url: "https://www.youtube.com/watch?v=8jLOx1hD3_o",
      },
    ],
  },
  {
    name: "Go",
    aliases: ["golang", "go"],
    resources: [
      {
        type: "DOCUMENTATION",
        title: "Go Documentation",
        url: "https://go.dev/doc/",
      },
      {
        type: "VIDEO",
        title: "Go Full Course - freeCodeCamp",
        url: "https://www.youtube.com/watch?v=un6ZyFkqFKo",
      },
    ],
  },

  // ---------- Frontend ----------
  {
    name: "React",
    aliases: ["react.js", "reactjs", "react"],
    resources: [
      { type: "DOCUMENTATION", title: "React Docs", url: "TODO" },
      { type: "VIDEO", title: "React Full Course", url: "TODO" },
    ],
  },
  {
    name: "Vue.js",
    aliases: ["vue.js", "vuejs", "vue"],
    resources: [
      { type: "DOCUMENTATION", title: "Vue.js Guide", url: "TODO" },
      { type: "VIDEO", title: "Vue.js Full Course", url: "TODO" },
    ],
  },
  {
    name: "Angular",
    aliases: ["angular"],
    resources: [
      { type: "DOCUMENTATION", title: "Angular Docs", url: "TODO" },
      { type: "VIDEO", title: "Angular Full Course", url: "TODO" },
    ],
  },
  {
    name: "Tailwind CSS",
    aliases: ["tailwindcss", "tailwind"],
    resources: [
      { type: "DOCUMENTATION", title: "Tailwind CSS Docs", url: "TODO" },
      { type: "VIDEO", title: "Tailwind CSS Crash Course", url: "TODO" },
    ],
  },
  {
    name: "Redux",
    aliases: ["redux"],
    resources: [
      { type: "DOCUMENTATION", title: "Redux Docs", url: "TODO" },
      { type: "VIDEO", title: "Redux Crash Course", url: "TODO" },
    ],
  },
  {
    name: "Zustand",
    aliases: ["zustand"],
    resources: [
      { type: "DOCUMENTATION", title: "Zustand Docs", url: "TODO" },
      { type: "VIDEO", title: "Zustand Crash Course", url: "TODO" },
    ],
  },

  // ---------- Backend ----------
  {
    name: "Node.js",
    aliases: ["node.js", "nodejs", "node"],
    resources: [
      { type: "DOCUMENTATION", title: "Node.js Docs", url: "TODO" },
      { type: "VIDEO", title: "Node.js Full Course", url: "TODO" },
    ],
  },
  {
    name: "Express.js",
    aliases: ["express.js", "expressjs", "express"],
    resources: [
      { type: "DOCUMENTATION", title: "Express.js Docs", url: "TODO" },
      { type: "VIDEO", title: "Express.js Crash Course", url: "TODO" },
    ],
  },
  {
    name: "Django",
    aliases: ["django"],
    resources: [
      { type: "DOCUMENTATION", title: "Django Docs", url: "TODO" },
      { type: "VIDEO", title: "Django Full Course", url: "TODO" },
    ],
  },
  {
    name: "Spring Boot",
    aliases: ["spring boot", "springboot", "spring"],
    resources: [
      { type: "DOCUMENTATION", title: "Spring Boot Docs", url: "TODO" },
      { type: "VIDEO", title: "Spring Boot Full Course", url: "TODO" },
    ],
  },
  {
    name: "REST APIs",
    aliases: ["restful", "rest api", "rest"],
    resources: [
      { type: "DOCUMENTATION", title: "REST API Tutorial", url: "TODO" },
      { type: "VIDEO", title: "REST API Crash Course", url: "TODO" },
    ],
  },
  {
    name: "GraphQL",
    aliases: ["graphql"],
    resources: [
      { type: "DOCUMENTATION", title: "GraphQL Docs", url: "TODO" },
      { type: "VIDEO", title: "GraphQL Crash Course", url: "TODO" },
    ],
  },
  {
    name: "Socket.io",
    aliases: ["socket.io", "socketio", "websockets", "websocket"],
    resources: [
      { type: "DOCUMENTATION", title: "Socket.io Docs", url: "TODO" },
      { type: "VIDEO", title: "Socket.io Crash Course", url: "TODO" },
    ],
  },

  // ---------- Databases ----------
  {
    name: "SQL",
    aliases: ["sql"],
    resources: [
      { type: "DOCUMENTATION", title: "SQL Tutorial", url: "TODO" },
      { type: "VIDEO", title: "SQL Full Course", url: "TODO" },
    ],
  },
  {
    name: "PostgreSQL",
    aliases: ["postgresql", "postgres"],
    resources: [
      { type: "DOCUMENTATION", title: "PostgreSQL Docs", url: "TODO" },
      { type: "VIDEO", title: "PostgreSQL Full Course", url: "TODO" },
    ],
  },
  {
    name: "MongoDB",
    aliases: ["mongodb", "mongo"],
    resources: [
      { type: "DOCUMENTATION", title: "MongoDB Docs", url: "TODO" },
      { type: "VIDEO", title: "MongoDB Full Course", url: "TODO" },
    ],
  },
  {
    name: "Redis",
    aliases: ["redis"],
    resources: [
      { type: "DOCUMENTATION", title: "Redis Docs", url: "TODO" },
      { type: "VIDEO", title: "Redis Crash Course", url: "TODO" },
    ],
  },

  // ---------- DevOps / Cloud ----------
  {
    name: "Docker",
    aliases: ["docker"],
    resources: [
      { type: "DOCUMENTATION", title: "Docker Docs", url: "TODO" },
      { type: "VIDEO", title: "Docker Full Course", url: "TODO" },
    ],
  },
  {
    name: "Kubernetes",
    aliases: ["kubernetes", "k8s"],
    resources: [
      { type: "DOCUMENTATION", title: "Kubernetes Docs", url: "TODO" },
      { type: "VIDEO", title: "Kubernetes Full Course", url: "TODO" },
    ],
  },
  {
    name: "AWS",
    aliases: ["amazon web services", "aws"],
    resources: [
      { type: "DOCUMENTATION", title: "AWS Documentation", url: "TODO" },
      { type: "VIDEO", title: "AWS Full Course", url: "TODO" },
    ],
  },
  {
    name: "Azure",
    aliases: ["azure"],
    resources: [
      { type: "DOCUMENTATION", title: "Microsoft Azure Docs", url: "TODO" },
      { type: "VIDEO", title: "Azure Full Course", url: "TODO" },
    ],
  },
  {
    name: "GCP",
    aliases: ["google cloud", "gcp"],
    resources: [
      { type: "DOCUMENTATION", title: "Google Cloud Docs", url: "TODO" },
      { type: "VIDEO", title: "GCP Full Course", url: "TODO" },
    ],
  },
  {
    name: "CI/CD",
    aliases: [
      "continuous integration",
      "continuous deployment",
      "ci/cd",
      "ci cd",
    ],
    resources: [
      { type: "DOCUMENTATION", title: "CI/CD Concepts Guide", url: "TODO" },
      { type: "VIDEO", title: "CI/CD Crash Course", url: "TODO" },
    ],
  },
  {
    name: "Git",
    aliases: ["version control", "git"],
    resources: [
      { type: "DOCUMENTATION", title: "Git Documentation", url: "TODO" },
      { type: "VIDEO", title: "Git & GitHub Full Course", url: "TODO" },
    ],
  },
  {
    name: "Linux/Bash",
    aliases: ["shell scripting", "bash", "linux"],
    resources: [
      { type: "DOCUMENTATION", title: "Bash Reference Manual", url: "TODO" },
      { type: "VIDEO", title: "Linux Command Line Full Course", url: "TODO" },
    ],
  },

  // ---------- Testing ----------
  {
    name: "Jest",
    aliases: ["jest"],
    resources: [
      { type: "DOCUMENTATION", title: "Jest Docs", url: "TODO" },
      { type: "VIDEO", title: "Jest Crash Course", url: "TODO" },
    ],
  },
  {
    name: "Cypress",
    aliases: ["cypress"],
    resources: [
      { type: "DOCUMENTATION", title: "Cypress Docs", url: "TODO" },
      { type: "VIDEO", title: "Cypress Crash Course", url: "TODO" },
    ],
  },
  {
    name: "Playwright",
    aliases: ["playwright"],
    resources: [
      { type: "DOCUMENTATION", title: "Playwright Docs", url: "TODO" },
      { type: "VIDEO", title: "Playwright Crash Course", url: "TODO" },
    ],
  },
  {
    name: "Mocha",
    aliases: ["mocha"],
    resources: [
      { type: "DOCUMENTATION", title: "Mocha Docs", url: "TODO" },
      { type: "VIDEO", title: "Mocha & Chai Crash Course", url: "TODO" },
    ],
  },
  {
    name: "Test-Driven Development",
    aliases: ["test driven development", "test-driven development", "tdd"],
    resources: [
      { type: "DOCUMENTATION", title: "TDD Guide", url: "TODO" },
      { type: "VIDEO", title: "TDD Crash Course", url: "TODO" },
    ],
  },

  // ---------- CS Fundamentals ----------
  {
    name: "Data Structures",
    aliases: ["data structures"],
    resources: [
      { type: "DOCUMENTATION", title: "Data Structures Guide", url: "TODO" },
      { type: "VIDEO", title: "Data Structures Full Course", url: "TODO" },
    ],
  },
  {
    name: "Algorithms",
    aliases: ["algorithm", "algorithms"],
    resources: [
      { type: "DOCUMENTATION", title: "Algorithms Guide", url: "TODO" },
      { type: "VIDEO", title: "Algorithms Full Course", url: "TODO" },
    ],
  },
  {
    name: "System Design",
    aliases: ["system design"],
    resources: [
      { type: "DOCUMENTATION", title: "System Design Primer", url: "TODO" },
      { type: "VIDEO", title: "System Design Full Course", url: "TODO" },
    ],
  },
  {
    name: "Object-Oriented Programming",
    aliases: ["object oriented programming", "object-oriented", "oop"],
    resources: [
      { type: "DOCUMENTATION", title: "OOP Concepts Guide", url: "TODO" },
      { type: "VIDEO", title: "OOP Crash Course", url: "TODO" },
    ],
  },
  {
    name: "Design Patterns",
    aliases: ["design patterns"],
    resources: [
      { type: "DOCUMENTATION", title: "Design Patterns Guide", url: "TODO" },
      { type: "VIDEO", title: "Design Patterns Crash Course", url: "TODO" },
    ],
  },
  {
    name: "Big O / Time Complexity",
    aliases: ["space complexity", "time complexity", "big o"],
    resources: [
      { type: "DOCUMENTATION", title: "Big O Notation Guide", url: "TODO" },
      { type: "VIDEO", title: "Big O Crash Course", url: "TODO" },
    ],
  },

  // ---------- Architecture ----------
  {
    name: "Microservices",
    aliases: ["microservice", "microservices"],
    resources: [
      { type: "DOCUMENTATION", title: "Microservices Guide", url: "TODO" },
      { type: "VIDEO", title: "Microservices Crash Course", url: "TODO" },
    ],
  },
  {
    name: "Load Balancing",
    aliases: ["load balancer", "load balancing"],
    resources: [
      { type: "DOCUMENTATION", title: "Load Balancing Guide", url: "TODO" },
      { type: "VIDEO", title: "Load Balancing Crash Course", url: "TODO" },
    ],
  },
  {
    name: "Message Queues",
    aliases: ["kafka", "rabbitmq", "message queues", "message queue"],
    resources: [
      { type: "DOCUMENTATION", title: "Message Queues Guide", url: "TODO" },
      { type: "VIDEO", title: "Message Queues Crash Course", url: "TODO" },
    ],
  },

  // ---------- Security ----------
  {
    name: "Authentication & Authorization",
    aliases: ["authorization", "authentication"],
    resources: [
      { type: "DOCUMENTATION", title: "Auth Concepts Guide", url: "TODO" },
      { type: "VIDEO", title: "Authentication Crash Course", url: "TODO" },
    ],
  },
  {
    name: "JWT",
    aliases: ["json web token", "jwt"],
    resources: [
      { type: "DOCUMENTATION", title: "JWT Introduction", url: "TODO" },
      { type: "VIDEO", title: "JWT Crash Course", url: "TODO" },
    ],
  },
  {
    name: "OAuth 2.0",
    aliases: ["oauth2", "oauth 2.0", "oauth"],
    resources: [
      { type: "DOCUMENTATION", title: "OAuth 2.0 Guide", url: "TODO" },
      { type: "VIDEO", title: "OAuth 2.0 Crash Course", url: "TODO" },
    ],
  },
  {
    name: "Web Security (OWASP)",
    aliases: ["sql injection", "csrf", "xss", "owasp"],
    resources: [
      { type: "DOCUMENTATION", title: "OWASP Top 10", url: "TODO" },
      { type: "VIDEO", title: "Web Security Crash Course", url: "TODO" },
    ],
  },
];

async function main() {
  for (const { resources, ...skillFields } of skills) {
    const skill = await prisma.skill.upsert({
      where: { name: skillFields.name },
      update: { aliases: skillFields.aliases },
      create: skillFields,
    });

    // Wipe and recreate resources each run so re-seeding after editing
    // URLs above never leaves stale/duplicate rows behind.
    await prisma.learningResource.deleteMany({ where: { skillId: skill.id } });
    await prisma.learningResource.createMany({
      data: resources.map((r) => ({ ...r, skillId: skill.id })),
    });

    console.log(`Seeded: ${skill.name} (${resources.length} resources)`);
  }
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
