import React, { useState } from "react";

// EmailJS credentials (put your actual keys here or in .env)
const SERVICE_ID = "service_fao67t8";
const TEMPLATE_ID = "template_jzc9e7c";
const PUBLIC_KEY = "ObXF29egzwkfDTLRY";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  
  // Simple validation
  const validate = () => {
    if (!form.name.trim()) return "Please enter Name";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      return "Please enter a valid Email";
    if (!form.message.trim()) return "Please enter Message";
    return "";
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const validation = validate();
    if (validation) return setError(validation);
    setSubmitted(true);

    try {
      const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {
          origin: "http://localhost",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: SERVICE_ID,
          template_id: TEMPLATE_ID,
          user_id: PUBLIC_KEY,
          template_params: form,
        }),
      });

      if (res.ok) {
        setShowSuccess(true);
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => setShowSuccess(false), 3200);
      } else {
        setError("Failed to send. Try again!");
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setSubmitted(false);
    }
  };

  return (
    <div className="pixel-contact-form">
      {showSuccess ? (
        <div className="form-success">
          <span role="img" aria-label="sparkle">✨</span> Message sent!
        </div>
      ) : (
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="form-title">Contact Me</div>
          <div className="pixel-input-group">
            <label>Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              autoComplete="off"
              disabled={submitted}
            />
          </div>
          <div className="pixel-input-group">
            <label>Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              autoComplete="off"
              disabled={submitted}
            />
          </div>
          <div className="pixel-input-group">
            <label>Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={4}
              autoComplete="off"
              disabled={submitted}
            />
          </div>
          {error && <div className="form-error">{error}</div>}
          <button type="submit" className="pixel-btn" disabled={submitted}>
            {submitted ? "Sending..." : "Send Message"}
          </button>
        </form>
      )}
    </div>
  );
}
