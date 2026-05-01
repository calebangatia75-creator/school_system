"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

const gradeOptions = ["PP1", "PP2", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9"];

const initialForm = {
  parentName: "",
  relationshipToStudent: "",
  phone: "",
  alternatePhone: "",
  email: "",
  homeLocation: "",
  studentName: "",
  studentGender: "",
  dateOfBirth: "",
  birthCertificateNumber: "",
  applyingGrade: "",
  currentSchool: "",
  lastCompletedGrade: "",
  transferReason: "",
  transportMode: "",
  specialNeeds: "",
  medicalInformation: "",
  siblingInformation: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  emergencyContactRelationship: "",
  parentExpectation: ""
};

type AdmissionApplicationFormProps = {
  title: string;
  intro: string;
};

export function AdmissionApplicationForm({ title, intro }: AdmissionApplicationFormProps) {
  const { addToast } = useToast();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const updateField = (field: keyof typeof initialForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionType: "application",
          ...form
        })
      });

      const payload = (await response.json()) as { error?: string; message?: string };
      if (!response.ok) {
        addToast({
          title: "Application not submitted",
          description: payload.error ?? "Check the form and try again.",
          variant: "error"
        });
        return;
      }

      setForm(initialForm);
      setSuccessMessage(payload.message ?? "Application submitted successfully.");
      addToast({ title: "Application submitted", variant: "success" });
    } catch {
      addToast({
        title: "Application not submitted",
        description: "Unable to submit the application right now.",
        variant: "error"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-[1.75rem] bg-white p-8 shadow-xl ring-1 ring-slate-100">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-bold text-navy">{title}</h2>
        <p className="mt-3 text-slate-600">{intro}</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Parent or guardian name</span>
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
              value={form.parentName}
              onChange={(event) => updateField("parentName", event.target.value)}
              required
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Relationship to student</span>
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
              value={form.relationshipToStudent}
              onChange={(event) => updateField("relationshipToStudent", event.target.value)}
              placeholder="Mother, Father, Guardian"
              required
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Primary phone number</span>
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              required
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Alternative phone number</span>
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
              value={form.alternatePhone}
              onChange={(event) => updateField("alternatePhone", event.target.value)}
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Email address</span>
            <input
              type="email"
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Home location</span>
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
              value={form.homeLocation}
              onChange={(event) => updateField("homeLocation", event.target.value)}
              placeholder="Estate, town, or village"
              required
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Student full name</span>
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
              value={form.studentName}
              onChange={(event) => updateField("studentName", event.target.value)}
              required
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Student gender</span>
            <select
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
              value={form.studentGender}
              onChange={(event) => updateField("studentGender", event.target.value)}
              required
            >
              <option value="">Select gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Date of birth</span>
            <input
              type="date"
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
              value={form.dateOfBirth}
              onChange={(event) => updateField("dateOfBirth", event.target.value)}
              required
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Birth certificate number</span>
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
              value={form.birthCertificateNumber}
              onChange={(event) => updateField("birthCertificateNumber", event.target.value)}
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Applying for grade</span>
            <select
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
              value={form.applyingGrade}
              onChange={(event) => updateField("applyingGrade", event.target.value)}
              required
            >
              <option value="">Select grade</option>
              {gradeOptions.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Last completed grade</span>
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
              value={form.lastCompletedGrade}
              onChange={(event) => updateField("lastCompletedGrade", event.target.value)}
              required
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Current or previous school</span>
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
              value={form.currentSchool}
              onChange={(event) => updateField("currentSchool", event.target.value)}
              required
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Transport plan</span>
            <select
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
              value={form.transportMode}
              onChange={(event) => updateField("transportMode", event.target.value)}
              required
            >
              <option value="">Select transport</option>
              <option value="Picked by parent">Picked by parent</option>
              <option value="School transport">School transport</option>
              <option value="Private transport">Private transport</option>
              <option value="Walking">Walking</option>
            </select>
          </label>
        </div>

        <div className="grid gap-4">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Why do you want this transfer or admission?</span>
            <textarea
              rows={4}
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
              value={form.transferReason}
              onChange={(event) => updateField("transferReason", event.target.value)}
              required
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Learning support or special needs</span>
            <textarea
              rows={3}
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
              value={form.specialNeeds}
              onChange={(event) => updateField("specialNeeds", event.target.value)}
              placeholder="Share any academic, physical, or counseling support needed"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Medical information, allergies, or medication</span>
            <textarea
              rows={3}
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
              value={form.medicalInformation}
              onChange={(event) => updateField("medicalInformation", event.target.value)}
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Sibling information</span>
            <textarea
              rows={3}
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
              value={form.siblingInformation}
              onChange={(event) => updateField("siblingInformation", event.target.value)}
              placeholder="Mention siblings already in school or applying together"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="space-y-2 md:col-span-1">
            <span className="text-sm font-medium text-slate-700">Emergency contact name</span>
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
              value={form.emergencyContactName}
              onChange={(event) => updateField("emergencyContactName", event.target.value)}
              required
            />
          </label>
          <label className="space-y-2 md:col-span-1">
            <span className="text-sm font-medium text-slate-700">Emergency contact phone</span>
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
              value={form.emergencyContactPhone}
              onChange={(event) => updateField("emergencyContactPhone", event.target.value)}
              required
            />
          </label>
          <label className="space-y-2 md:col-span-1">
            <span className="text-sm font-medium text-slate-700">Relationship to emergency contact</span>
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
              value={form.emergencyContactRelationship}
              onChange={(event) => updateField("emergencyContactRelationship", event.target.value)}
              required
            />
          </label>
        </div>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">What do you want the school leaders to know?</span>
          <textarea
            rows={4}
            className="w-full rounded-xl border border-slate-200 px-4 py-3"
            value={form.parentExpectation}
            onChange={(event) => updateField("parentExpectation", event.target.value)}
            placeholder="Tell the Headteacher and Deputy Headteacher about the learner, goals, or concerns"
            required
          />
        </label>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
          Applications from this form are routed to the Headteacher and Deputy Headteacher for review.
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button type="submit" disabled={submitting} className="h-12 rounded-xl px-8">
            {submitting ? "Submitting..." : "Submit Application"}
          </Button>
          {successMessage ? <p className="text-sm text-slate-600">{successMessage}</p> : null}
        </div>
      </form>
    </section>
  );
}
