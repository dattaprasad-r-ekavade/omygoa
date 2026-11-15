import { EventForm } from "@/components/admin/forms";
import { PageIntro } from "@/components/workspace/table";
import { listTowns } from "@/lib/queries";

export default async function NewEventPage() {
  const towns = await listTowns();
  return (
    <div>
      <PageIntro title="New event" />
      <EventForm towns={towns} />
    </div>
  );
}
