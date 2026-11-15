import { notFound } from "next/navigation";
import { BusinessForm } from "@/components/admin/forms";
import { PageIntro } from "@/components/workspace/table";
import { getBusinessById, listCategories, listTowns } from "@/lib/queries";

export default async function EditBusinessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [business, categories, towns] = await Promise.all([getBusinessById(id), listCategories(), listTowns()]);
  if (!business) notFound();
  return (
    <div>
      <PageIntro title={business.name} hint="Changes publish on the public listing when the listing status is active." />
      <BusinessForm business={business} categories={categories} towns={towns} />
    </div>
  );
}
