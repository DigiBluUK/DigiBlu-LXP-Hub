// Course providers shown in the home page strip, in this order. Each links to
// Browse filtered to that provider. A provider only appears when the catalogue
// holds at least one of its courses (see PROVIDERS in src/lib/catalogue.ts), so
// the strip can never show a logo the hub does not back up.
//
// Providers without an entry in provider-icons.ts show as a name only. Microsoft,
// OpenAI and AWS restrict the use of their logos, so add official artwork only
// with permission (e.g. through a partner programme).
export interface ProviderEntry {
  slug: string;
  name: string;
  /** Matched as whole words, ignoring case, against each course's provider field. */
  match: string[];
}

export const PROVIDER_LIST: ProviderEntry[] = [
  { slug: "microsoft", name: "Microsoft", match: ["Microsoft"] },
  { slug: "anthropic", name: "Anthropic", match: ["Anthropic"] },
  { slug: "google", name: "Google", match: ["Google"] },
  { slug: "openai", name: "OpenAI", match: ["OpenAI"] },
  { slug: "aws", name: "AWS", match: ["AWS", "Amazon Web Services"] },
  { slug: "github", name: "GitHub", match: ["GitHub"] },
  { slug: "scrum-org", name: "Scrum.org", match: ["Scrum.org"] },
  { slug: "coursera", name: "Coursera", match: ["Coursera"] },
  { slug: "linkedin-learning", name: "LinkedIn Learning", match: ["LinkedIn Learning"] },
  { slug: "udemy", name: "Udemy", match: ["Udemy"] },
  { slug: "pmi", name: "PMI", match: ["PMI"] },
  { slug: "linux-foundation", name: "Linux Foundation", match: ["Linux Foundation"] },
  { slug: "celonis", name: "Celonis", match: ["Celonis"] },
  { slug: "asq", name: "ASQ", match: ["ASQ"] },
  { slug: "kaggle", name: "Kaggle", match: ["Kaggle"] },
  { slug: "atlassian", name: "Atlassian", match: ["Atlassian"] },
  { slug: "cmi", name: "CMI", match: ["CMI"] },
  { slug: "freecodecamp", name: "freeCodeCamp", match: ["freeCodeCamp"] },
  { slug: "open-university", name: "The Open University", match: ["Open University"] },
  { slug: "ted", name: "TED", match: ["TED"] },
  { slug: "mdn", name: "MDN Web Docs", match: ["MDN"] },
  { slug: "owasp", name: "OWASP", match: ["OWASP"] },
];
