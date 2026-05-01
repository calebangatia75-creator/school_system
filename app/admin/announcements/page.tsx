"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { RichTextEditor } from "@/components/ui/rich-text";
import { useToast } from "@/components/ui/toast";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { announcementSchema } from "@/lib/validators";
import type { z } from "zod";

type AnnouncementFormValues = z.infer<typeof announcementSchema>;

type Announcement = {
  id: string;
  title: string;
  content: string;
  target_roles: string[] | null;
  target_grades: string[] | null;
  priority: "low" | "normal" | "high" | "urgent";
  expires_at: string | null;
  created_at: string | null;
};

const gradeOptions = ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9"];

export default function AdminAnnouncementsPage() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [content, setContent] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [grades, setGrades] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue
  } = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: { priority: "normal" }
  });

  const fetchAnnouncements = async () => {
    setLoading(true);
    const response = await fetch("/api/admin/announcements");
    const payload = (await response.json()) as Announcement[] & { error?: string };
    if (!response.ok) {
      addToast({ title: "Load failed", description: payload.error, variant: "error" });
    } else {
      setAnnouncements(payload as Announcement[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleToggle = (value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const onSubmit = async (values: AnnouncementFormValues) => {
    const response = await fetch("/api/admin/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editing?.id,
        ...values,
        content,
        target_roles: roles.length ? roles : null,
        target_grades: grades.length ? grades : null
      })
    });
    const payload = (await response.json()) as { error?: string };
    if (!response.ok) {
      addToast({ title: "Save failed", description: payload.error, variant: "error" });
      return;
    }

    addToast({ title: editing ? "Announcement updated" : "Announcement posted", variant: "success" });
    reset();
    setContent("");
    setRoles([]);
    setGrades([]);
    setEditing(null);
    fetchAnnouncements();
  };

  const handleEdit = (announcement: Announcement) => {
    setEditing(announcement);
    reset({
      title: announcement.title,
      priority: announcement.priority,
      expires_at: announcement.expires_at ?? ""
    });
    setContent(announcement.content);
    setValue("content", announcement.content);
    setRoles(announcement.target_roles ?? []);
    setGrades(announcement.target_grades ?? []);
  };

  const handleDelete = async (announcement: Announcement) => {
    const confirm = window.confirm("Delete this announcement?");
    if (!confirm) return;
    const response = await fetch(`/api/admin/announcements?id=${announcement.id}`, { method: "DELETE" });
    const payload = (await response.json()) as { error?: string };
    if (!response.ok) {
      addToast({ title: "Delete failed", description: payload.error, variant: "error" });
      return;
    }
    addToast({ title: "Announcement deleted", variant: "success" });
    fetchAnnouncements();
  };

  return (
    <>
      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-navy">{editing ? "Edit Announcement" : "Create Announcement"}</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <Input placeholder="Title" {...register("title")} />
                {errors.title ? <p className="mt-1 text-xs text-warning">{errors.title.message}</p> : null}
              </div>
              <input type="hidden" {...register("content")} />
              <RichTextEditor value={content} onChange={(value) => {
                setContent(value);
                setValue("content", value);
              }} />
              {errors.content ? <p className="mt-1 text-xs text-warning">{errors.content.message}</p> : null}
              <div className="grid sm:grid-cols-2 gap-3">
                <select className="rounded-xl border border-slate-200 px-4 py-3" {...register("priority")}>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
                <Input type="date" {...register("expires_at")} />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-navy">Target roles</p>
                <div className="flex flex-wrap gap-2 text-sm text-textBody">
                  {["parent", "teacher", "student"].map((role) => (
                    <label key={role} className="flex items-center gap-2">
                      <input type="checkbox" checked={roles.includes(role)} onChange={() => handleToggle(role, setRoles)} />
                      {role}
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-navy">Target grades</p>
                <div className="flex flex-wrap gap-2 text-xs text-textBody">
                  {gradeOptions.map((grade) => (
                    <label key={grade} className="flex items-center gap-2">
                      <input type="checkbox" checked={grades.includes(grade)} onChange={() => handleToggle(grade, setGrades)} />
                      {grade}
                    </label>
                  ))}
                </div>
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : editing ? "Update Announcement" : "Publish Announcement"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-navy">Active Notices</h2>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-textBody">
            {loading ? (
              <Skeleton className="h-24" />
            ) : announcements.length === 0 ? (
              <EmptyState title="No announcements" description="Post a new update to reach parents and school teams." />
            ) : (
              announcements.map((announcement) => (
                <div key={announcement.id} className="border-b border-slate-200 pb-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-navy">{announcement.title}</p>
                    <Badge variant={announcement.priority === "urgent" ? "urgent" : announcement.priority === "high" ? "warning" : "default"}>
                      {announcement.priority}
                    </Badge>
                  </div>
                  <div className="text-xs text-textBody mt-2" dangerouslySetInnerHTML={{ __html: announcement.content }} />
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => handleEdit(announcement)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => handleDelete(announcement)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
