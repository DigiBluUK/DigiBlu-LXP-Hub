import type { Outcome, SkillArea } from "@/lib/types";

// The areas of expertise, in the order they appear across the hub. Adding an area
// means adding it here and to SKILL_AREA_IDS in src/lib/types.ts.
export const SKILL_AREAS: SkillArea[] = [
  {
    id: "data-analytics",
    name: "Data & Analytics",
    summary: "Power BI, Excel, SQL and Python - turning data into decisions.",
    description:
      "Reporting and dashboards in Power BI and Excel, SQL and Python for analysis, and the data engineering that feeds it all. Start here if you work with numbers, reports or data pipelines.",
    roles: ["Data Analyst", "BI Developer", "Data Engineer", "Data Scientist"],
  },
  {
    id: "ai",
    name: "Artificial Intelligence",
    summary: "From everyday AI literacy and Copilot to building AI solutions.",
    description:
      "Practical AI for everyone: using generative AI and Microsoft 365 Copilot well, writing good prompts, and for technical roles, building, deploying and governing AI on Azure.",
    roles: ["All employees", "Business User", "Data Scientist", "ML Engineer", "Software Engineer"],
  },
  {
    id: "automation-low-code",
    name: "Automation & Low-Code",
    summary: "Power Automate, the Power Platform and RPA - automating everyday processes.",
    description:
      "Automate processes with Microsoft Power Automate and the wider Power Platform: cloud flows, desktop flows (RPA), approvals, AI Builder and Copilot Studio, and the governance that keeps automation safe as it grows.",
    roles: [
      "Business User",
      "Business Analyst",
      "Automation Developer",
      "RPA Developer",
      "Power Platform Developer",
      "Solution Architect",
    ],
  },
  {
    id: "process-improvement",
    name: "Process Improvement",
    summary: "Lean, Six Sigma, process mapping and process mining - making work flow better.",
    description:
      "Find and fix what slows work down. Lean and Six Sigma, continuous improvement, mapping processes with BPMN, and process mining to see how work really flows.",
    roles: [
      "Process Analyst",
      "Business Analyst",
      "Process Owner",
      "Continuous Improvement Lead",
      "Operations Manager",
      "Consultant",
    ],
  },
  {
    id: "software-development",
    name: "Software Development",
    summary: "Modern web development, core languages, Git and testing.",
    description:
      "Build, test and ship software. Web fundamentals, JavaScript, TypeScript, Python and .NET, version control with Git and GitHub, testing and secure coding practice.",
    roles: [
      "Software Engineer",
      "Front-end Developer",
      "Back-end Developer",
      "DevOps Engineer",
      "QA / Test Engineer",
    ],
  },
  {
    id: "cloud-infrastructure",
    name: "Cloud & Infrastructure",
    summary: "Azure, AWS, containers, infrastructure as code and security.",
    description:
      "Design and run the platforms we deliver on. Azure and AWS from fundamentals to architect level, networking, Kubernetes, Terraform and security fundamentals.",
    roles: [
      "Cloud Engineer",
      "Infrastructure Engineer",
      "DevOps Engineer",
      "Security Engineer",
      "Solutions Architect",
    ],
  },
  {
    id: "project-product-management",
    name: "Project & Product Management",
    summary: "PRINCE2, PMP, Agile and Scrum, product thinking and analysis.",
    description:
      "Deliver change well. Recognised project methods such as PRINCE2 and PMP, Agile and Scrum, product management fundamentals and business analysis.",
    roles: [
      "Project Manager",
      "Product Manager",
      "Product Owner",
      "Scrum Master",
      "Business Analyst",
      "Delivery Manager",
    ],
  },
  {
    id: "leadership-soft-skills",
    name: "Leadership & Soft Skills",
    summary: "Communication, feedback, leading teams and managing your time.",
    description:
      "The skills that make everything else work. Communicating clearly, giving and receiving feedback, leading and coaching a team, and managing your own time and energy.",
    roles: ["All employees", "Team Lead", "Manager", "Senior Leader"],
  },
];

export const OUTCOME_INFO: Record<Outcome, { heading: string; blurb: string }> = {
  Certification: {
    heading: "Certifications",
    blurb:
      "Industry-recognised credentials, usually earned by passing an exam. The strongest evidence for formal career progression.",
  },
  "Completion certificate": {
    heading: "Courses with a certificate",
    blurb:
      "Structured courses where the provider confirms you finished. Good evidence of learning, but not a formal credential.",
  },
  Knowledge: {
    heading: "Knowledge resources",
    blurb:
      "Videos, guides and tutorials. No certificate, just the know-how - often free and quick to start.",
  },
};
