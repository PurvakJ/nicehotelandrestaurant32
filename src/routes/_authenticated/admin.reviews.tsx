import { createFileRoute } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { PageTitle } from "@/components/admin/AdminShell";
import { ResourceManager, StatusBadge, type Field, type Column } from "@/components/admin/ResourceManager";
import { setStatus } from "@/lib/admin/data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/reviews")({ component: Reviews });

const fields: Field[] = [
  { name: "author", label: "Author", type: "text", required: true },
  { name: "rating", label: "Rating (1-5)", type: "number", default: 5 },
  { name: "source", label: "Source", type: "select", options: ["manual", "google", "website"], default: "manual" },
  { name: "status", label: "Status", type: "select", options: ["pending", "approved", "rejected"], default: "pending" },
  { name: "is_featured", label: "Featured", type: "boolean", default: false },
  { name: "content", label: "Review", type: "textarea" },
];
const columns: Column[] = [
  { name: "author", label: "Author" },
  { name: "rating", label: "Rating", render: (r) => "★".repeat(Number(r.rating) || 0) },
  { name: "content", label: "Review", render: (r) => <span className="line-clamp-2 max-w-xs text-xs text-muted-foreground">{r.content}</span> },
  { name: "source", label: "Source", render: (r) => <span className="capitalize">{r.source}</span> },
  { name: "status", label: "Status", render: (r) => <StatusBadge value={r.status} /> },
  { name: "is_featured", label: "Featured", render: (r) => r.is_featured ? "★" : "—" },
];

function Reviews() {
  const quick = async (id: string, status: string, reload: () => void) => {
    try { await setStatus("reviews", id, { status }); toast.success(`Marked ${status}`); reload(); }
    catch (e: any) { toast.error(e.message); }
  };
  return (
    <div>
      <PageTitle title="Review Management" subtitle="Approve, feature & moderate guest reviews" />
      <ResourceManager table="reviews" fields={fields} columns={columns} searchKeys={["author", "content"]}
        rowActions={(row, reload) => (
          <>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-[#2E7D32]" title="Approve" onClick={() => quick(row.id, "approved", reload)}><Check className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-[#C62828]" title="Reject" onClick={() => quick(row.id, "rejected", reload)}><X className="h-4 w-4" /></Button>
          </>
        )} />
    </div>
  );
}