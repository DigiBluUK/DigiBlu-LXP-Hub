"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { Icon } from "@/components/Icon";
import { HUB_MAILBOX, MESSAGE_TOPICS, SUBJECT_PREFIX, type MessageTopic } from "@/content/contact";
import { SKILL_AREAS } from "@/content/skill-areas";
import { getCourse } from "@/lib/catalogue";
import { COSTS, OUTCOMES } from "@/lib/types";

// Two forms on one page: request a course, or send a message. Neither stores
// anything: submitting opens the person's email app with the text filled in,
// addressed to HUB_MAILBOX. Links elsewhere in the hub pre-fill them through
// the URL, e.g. /contact/?type=request&area=ai or ?type=message&topic=problem&course=<id>.

type Mode = "request" | "message";
type Sent = { to: string; subject: string; body: string };

const MAX_TEXT = 1200; // keeps the whole email inside what mail apps accept in a link

const hubUrl = () => `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}`;

function Field({ label, hint, children, id }: { label: string; hint?: string; children: ReactNode; id: string }) {
  return (
    <div className="form-field">
      <label htmlFor={id} className="form-field__label">
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="form-field__hint">
          {hint}
        </p>
      )}
      {children}
    </div>
  );
}

export function ContactForms() {
  const params = useSearchParams();
  const course = getCourse(params.get("course") ?? "");
  const [mode, setMode] = useState<Mode>(params.get("type") === "message" || course ? "message" : "request");
  const [sent, setSent] = useState<Sent | null>(null);
  const [copied, setCopied] = useState(false);

  // Request a course
  const [title, setTitle] = useState(params.get("title") ?? "");
  const [link, setLink] = useState("");
  const [provider, setProvider] = useState("");
  const [area, setArea] = useState(SKILL_AREAS.some((a) => a.id === params.get("area")) ? params.get("area")! : "");
  const [kind, setKind] = useState("");
  const [cost, setCost] = useState("");
  const [why, setWhy] = useState("");

  // Send a message
  const initialTopic = MESSAGE_TOPICS.find((t) => t.value === params.get("topic"))?.value;
  const [topic, setTopic] = useState<MessageTopic>(initialTopic ?? (course ? "problem" : "question"));
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const switchMode = (next: Mode) => {
    setMode(next);
    setErrors({});
  };

  const open = (subject: string, lines: string[]) => {
    const body = [...lines, "", `Sent from the DigiBlu Knowledge Hub: ${hubUrl()}/contact/`].join("\n");
    const href = `mailto:${HUB_MAILBOX}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent({ to: HUB_MAILBOX, subject, body });
    setCopied(false);
    // A link click hands the mailto: to the email app without leaving the page.
    Object.assign(document.createElement("a"), { href }).click();
  };

  const submitRequest = (event: FormEvent) => {
    event.preventDefault();
    const problems: Record<string, string> = {};
    if (!title.trim()) problems.title = "Tell us the course, certification or resource.";
    if (link.trim() && !/^https?:\/\/\S+\.\S+/.test(link.trim())) problems.link = "Enter a full web address, starting with https://";
    if (!why.trim()) problems.why = "Tell us who it would help and why.";
    setErrors(problems);
    if (Object.keys(problems).length) return;
    const areaName = SKILL_AREAS.find((a) => a.id === area)?.name ?? "Not sure";
    open(`${SUBJECT_PREFIX} Course request: ${title.trim()}`, [
      "Course request",
      "",
      `What to add: ${title.trim()}`,
      `Link: ${link.trim() || "Not given"}`,
      `Provider: ${provider.trim() || "Not given"}`,
      `Learning: ${areaName}`,
      `What it gives: ${kind || "Not sure"}`,
      `Cost: ${cost || "Not sure"}`,
      "",
      "Who it would help and why:",
      why.trim(),
    ]);
  };

  const submitMessage = (event: FormEvent) => {
    event.preventDefault();
    const problems: Record<string, string> = {};
    if (!message.trim()) problems.message = "Write your message.";
    setErrors(problems);
    if (Object.keys(problems).length) return;
    const topicLabel = MESSAGE_TOPICS.find((t) => t.value === topic)!.label;
    const about = course ? `${course.title} (${hubUrl()}/courses/${course.id}/)` : null;
    open(`${SUBJECT_PREFIX} ${topicLabel}${course ? `: ${course.title}` : ""}`, [
      `Topic: ${topicLabel}`,
      ...(about ? [`About: ${about}`] : []),
      "",
      message.trim(),
    ]);
  };

  const copy = async () => {
    if (!sent) return;
    try {
      await navigator.clipboard.writeText(`To: ${sent.to}\nSubject: ${sent.subject}\n\n${sent.body}`);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const describedBy = (id: string, hint = false) =>
    [hint ? `${id}-hint` : "", errors[id] ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
  const error = (id: string) =>
    errors[id] && (
      <p id={`${id}-error`} className="form-field__error" role="alert">
        {errors[id]}
      </p>
    );

  if (sent) {
    return (
      <div className="panel max-w-2xl" role="status">
        <p className="filter-group__label">Almost done</p>
        <h2 className="h-section">Press Send in your email</h2>
        <p className="muted mt-3">
          Your email app should have opened a new message to <strong className="text-[var(--text)]">{sent.to}</strong>{" "}
          with everything filled in. Check it and press Send. The hub team will reply to you by email.
        </p>
        <p className="muted mt-3">
          Nothing opened? Copy the message and paste it into a new email to {sent.to}.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" className="btn btn-primary" onClick={copy}>
            {copied ? "Copied" : "Copy the message"}
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => setSent(null)}>
            <Icon name="back" size={16} /> Back to the form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="segmented" role="group" aria-label="What would you like to do?">
        <button type="button" aria-pressed={mode === "request"} onClick={() => switchMode("request")}>
          Request a course
        </button>
        <button type="button" aria-pressed={mode === "message"} onClick={() => switchMode("message")}>
          Send a message
        </button>
      </div>

      {!HUB_MAILBOX && (
        <p className="notice mt-6" role="note">
          These forms are not connected to a mailbox yet, so they cannot send. They will work as soon as the hub team
          sets one up.
        </p>
      )}

      {mode === "request" ? (
        <form className="form mt-8" onSubmit={submitRequest} noValidate>
          <p className="muted">
            Know a course, certification or resource that belongs here? Tell us and we will review it. If it fits, we
            will add it and let you know.
          </p>
          <Field id="title" label="What should we add?">
            <input
              id="title"
              className="input"
              value={title}
              maxLength={200}
              onChange={(e) => setTitle(e.target.value)}
              aria-invalid={!!errors.title}
              aria-describedby={describedBy("title")}
              autoComplete="off"
            />
            {error("title")}
          </Field>
          <Field id="link" label="Link (optional)" hint="The course or provider page, if you have it.">
            <input
              id="link"
              className="input"
              type="url"
              inputMode="url"
              value={link}
              maxLength={500}
              onChange={(e) => setLink(e.target.value)}
              aria-invalid={!!errors.link}
              aria-describedby={describedBy("link", true)}
              placeholder="https://"
            />
            {error("link")}
          </Field>
          <div className="form-grid">
            <Field id="provider" label="Provider (optional)">
              <input
                id="provider"
                className="input"
                value={provider}
                maxLength={120}
                onChange={(e) => setProvider(e.target.value)}
                placeholder="e.g. Microsoft Learn"
              />
            </Field>
            <Field id="area" label="Learning">
              <select id="area" className="input" value={area} onChange={(e) => setArea(e.target.value)}>
                <option value="">Not sure</option>
                {SKILL_AREAS.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="kind" label="What does it give you?">
              <select id="kind" className="input" value={kind} onChange={(e) => setKind(e.target.value)}>
                <option value="">Not sure</option>
                {OUTCOMES.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="cost" label="Cost">
              <select id="cost" className="input" value={cost} onChange={(e) => setCost(e.target.value)}>
                <option value="">Not sure</option>
                {COSTS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field id="why" label="Who would it help, and why?">
            <textarea
              id="why"
              className="input textarea"
              rows={5}
              value={why}
              maxLength={MAX_TEXT}
              onChange={(e) => setWhy(e.target.value)}
              aria-invalid={!!errors.why}
              aria-describedby={describedBy("why")}
            />
            {error("why")}
          </Field>
          <button type="submit" className="btn btn-primary" disabled={!HUB_MAILBOX}>
            Send request
          </button>
        </form>
      ) : (
        <form className="form mt-8" onSubmit={submitMessage} noValidate>
          <p className="muted">
            Questions, feedback or something that needs fixing: send it to the hub team and we will reply by email.
          </p>
          {course && (
            <p className="notice" role="note">
              About: <strong>{course.title}</strong>
            </p>
          )}
          <Field id="topic" label="What is it about?">
            <select id="topic" className="input" value={topic} onChange={(e) => setTopic(e.target.value as MessageTopic)}>
              {MESSAGE_TOPICS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>
          <Field id="message" label="Your message">
            <textarea
              id="message"
              className="input textarea"
              rows={6}
              value={message}
              maxLength={MAX_TEXT}
              onChange={(e) => setMessage(e.target.value)}
              aria-invalid={!!errors.message}
              aria-describedby={describedBy("message")}
            />
            {error("message")}
          </Field>
          <button type="submit" className="btn btn-primary" disabled={!HUB_MAILBOX}>
            Send message
          </button>
        </form>
      )}

      <p className="muted mt-8 text-sm">
        Sending opens your own email app with the message filled in, so it comes from your DigiBlu address and the hub
        keeps no copy.
      </p>
    </div>
  );
}
