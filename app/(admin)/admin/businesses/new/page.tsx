import { BusinessForm } from "@/components/admin/forms";
import { PageIntro } from "@/components/workspace/table";
import { listCategories, listTowns } from "@/lib/queries";

export default async function NewBusinessPage() {
  const [categories, towns] = await Promise.all([listCategories(), listTowns()]);
  return (
    <div>
      <PageIntro title="New business" />
      <BusinessForm categories={categories} towns={towns} />
    </div>
  );
}
