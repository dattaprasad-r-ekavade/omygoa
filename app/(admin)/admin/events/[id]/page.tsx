import { notFound } from "next/navigation";
import { EventForm } from "@/components/admin/forms";
import { PageIntro } from "@/components/workspace/table";
import { getEventById, listTowns } from "@/lib/queries";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [event, towns] = await Promise.all([getEventById(id), listTowns()]);
  if (!event) notFound();
  return (
    <div>
      <PageIntro title={event.title} />
      <EventForm event={event} towns={towns} />
    </div>
  );
}
