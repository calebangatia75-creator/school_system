"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";

const templates = [
  { name: "School Closed", content: "School closed tomorrow due to rain. Stay safe!" },
  { name: "Fees Due", content: "Term fees due this Friday. Contact bursar for payment options." },
  { name: "Event Tomorrow", content: "Parent meeting tomorrow at 9AM. See you there!" }
];

type Announcement = {
  id: string;
  title: string;
  content: string;
  channel: "sms" | "whatsapp" | "portal";
  delivery_status: string | null;
  recipients_count: number;
  created_at: string;
};

export default function AdminAnnouncePage() {
  const { addToast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", channel: "sms" as "sms" | "whatsapp" | "portal" });

  const fetchAnnouncements = async () => {
    setLoading(true);
    const response = await fetch("/api/admin/announcements");
    const payload = (await response.json()) as Announcement[] & { error?: string };
    if (!response.ok) {
      addToast({ title: "Error", description: payload.error, variant: "error" });
    } else {
      setAnnouncements(payload as Announcement[]);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const response = await fetch("/api/admin/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        content: form.content,
        channel: form.channel,
        priority: "normal",
        target_roles: ["parent"]
      })
    });
    const payload = (await response.json()) as { error?: string };
    if (!response.ok) {
      addToast({ title: "Error", description: payload.error, variant: "error" });
    } else {
      addToast({ title: "Announcement saved", variant: "success" });
      setForm({ title: "", content: "", channel: "sms" });
      fetchAnnouncements();
    }
    setSending(false);
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <>
      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-navy">New Announcement</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <select
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
                value={form.channel}
                onChange={(event) =>
                  setForm({ ...form, channel: event.target.value as "sms" | "whatsapp" | "portal" })
                }
              >
                <option value="sms">SMS</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="portal">Portal</option>
              </select>
              <Textarea
                placeholder="Message..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={4}
              />
              <div className="flex gap-2">
                <Button type="button" variant="secondary" size="sm" onClick={() => {
                  const template = templates[Math.floor(Math.random() * templates.length)];
                  setForm({ title: template.name, content: template.content, channel: "sms" });
                }}>
                  Quick Template
                </Button>
                <Button type="submit" disabled={sending} className="flex-1">
                  {sending ? "Sending..." : "Send Announcement"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-navy">Recent Announcements</h2>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-20" />
            ) : announcements.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No announcements yet</p>
            ) : (
              <div className="space-y-3">
                {announcements.slice(0, 5).map((announcement) => (
                  <div key={announcement.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-semibold">{announcement.title}</p>
                      <p className="text-sm text-slate-600">{announcement.channel.toUpperCase()}</p>
                    </div>
                    <div className="text-right">
                      <Badge>{announcement.delivery_status || "Pending"}</Badge>
                      <p className="text-sm text-slate-600">{announcement.recipients_count} sent</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
