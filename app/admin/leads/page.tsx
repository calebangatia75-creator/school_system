"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";

type Lead = {
  id: string;
  parent_name: string | null;
  phone: string;
  child_name: string | null;
  grade: string | null;
  prev_school: string | null;
  message: string | null;
  application_kind?: "inquiry" | "full_application";
  assigned_roles?: string[] | null;
  details?: Record<string, string | boolean | null> | null;
  status: "new" | "contacted" | "documents" | "enrolled" | "rejected";
  created_at: string;
};

export default function AdminLeadsPage() {
  const { addToast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "new" | "contacted">("all");

  const fetchLeads = async () => {
    setLoading(true);
    const response = await fetch("/api/admin/leads");
    const payload = (await response.json()) as Lead[] & { error?: string };
    if (!response.ok) {
      addToast({ title: "Error", description: payload.error, variant: "error" });
    } else {
      setLeads(payload as Lead[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const updateStatus = async (id: string, newStatus: Lead["status"]) => {
    const response = await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus })
    });
    const payload = (await response.json()) as { error?: string };
    if (!response.ok) {
      addToast({ title: "Update failed", description: payload.error, variant: "error" });
      return;
    }
    addToast({ title: "Status updated", variant: "success" });
    fetchLeads();
  };

  const filteredLeads = leads.filter((lead) => statusFilter === "all" || lead.status === statusFilter);
  const statusCounts = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <>
      <div className="space-y-6">
        <div className="grid md:grid-cols-5 gap-4">
          {["new", "contacted", "documents", "enrolled"].map((status) => (
            <Card key={status}>
              <CardHeader className="pb-2">
                <p className="text-sm capitalize text-slate-600">{status}</p>
                <p className="text-2xl font-bold text-navy">{statusCounts[status] || 0}</p>
              </CardHeader>
            </Card>
          ))}
          <Card>
            <CardHeader className="pb-2">
              <p className="text-sm text-slate-600">Total</p>
              <p className="text-2xl font-bold text-navy">{leads.length}</p>
            </CardHeader>
          </Card>
        </div>

        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "new" | "contacted")}
            className="px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-navy focus:border-transparent"
          >
            <option value="all">All Leads</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
          </select>
          <Button onClick={fetchLeads} variant="secondary">Refresh</Button>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-navy">Recent Leads</h2>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16" />)}
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                No leads yet. WhatsApp button on homepage drives traffic here.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          P
                        </div>
                        <div>
                          <p className="font-semibold text-navy">{lead.parent_name || "Parent"}</p>
                          <p className="text-sm text-slate-600">
                            {(lead.child_name || "Applicant")} - {lead.grade || "Grade not set"}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-slate-500">
                        From: {lead.prev_school || "Not specified"} | {new Date(lead.created_at).toLocaleDateString()}
                      </div>
                      <div className="mt-1 text-sm text-slate-500">
                        Type: {lead.application_kind === "full_application" ? "Full application" : "Inquiry"}
                        {lead.assigned_roles?.length ? ` | Routed to: ${lead.assigned_roles.join(", ")}` : ""}
                      </div>
                      {lead.message ? <div className="mt-2 text-sm text-slate-600">{lead.message}</div> : null}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={lead.status === "enrolled" ? "success" : lead.status === "rejected" ? "urgent" : lead.status === "contacted" || lead.status === "documents" ? "warning" : "default"}>
                        {lead.status}
                      </Badge>
                      <select
                        value={lead.status}
                        onChange={(e) => updateStatus(lead.id, e.target.value as Lead["status"])}
                        className="px-3 py-1 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-navy"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="documents">Documents</option>
                        <option value="enrolled">Enrolled</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <Button size="sm" variant="secondary" onClick={() => window.open(`https://wa.me/${lead.phone.replace("+", "")}`, "_blank")}>
                        WhatsApp
                      </Button>
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
