// Where the Contact page's two forms send to. Both open the person's own email
// app (Outlook) with the message filled in and addressed here, so nothing is
// stored by the hub and every request arrives from a real DigiBlu address.
//
// Set this to the shared mailbox that owns the hub. While it is empty, the
// forms explain that they are not set up yet instead of sending anywhere.
export const HUB_MAILBOX = "";

export const SUBJECT_PREFIX = "[Learning Experience Hub]";

export const MESSAGE_TOPICS = [
  { value: "question", label: "A question" },
  { value: "feedback", label: "Feedback or an idea" },
  { value: "problem", label: "Something is wrong or out of date" },
  { value: "other", label: "Something else" },
] as const;

export type MessageTopic = (typeof MESSAGE_TOPICS)[number]["value"];
