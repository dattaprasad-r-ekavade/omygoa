import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { deleteBusiness, deleteEvent, saveBusiness, saveEvent } from "@/lib/actions/admin";

type Option = { id: string; name: string };

export function BusinessForm({
  business,
  categories,
  towns,
}: {
  business?: {
    id: string;
    name: string;
    slug: string;
    tagline: string | null;
    description: string;
    categoryId?: string | null;
    townId?: string | null;
    address: string | null;
    phone: string | null;
    whatsapp: string | null;
    email: string | null;
    plan: string;
    registrationStatus: string;
    listingStatus: string;
    businessType: string;
    featured: boolean;
    verified: boolean;
  };
  categories: Option[];
  towns: Option[];
}) {
  return (
    <form action={saveBusiness} className="grid gap-3 rounded-3xl bg-white p-5">
      {business ? <input type="hidden" name="id" value={business.id} /> : null}
      <Field label="Name" name="name" defaultValue={business?.name} required />
      <Field label="Slug" name="slug" defaultValue={business?.slug} />
      <Field label="Tagline" name="tagline" defaultValue={business?.tagline ?? ""} />
      <label className="text-sm font-medium">
        Description
        <Textarea name="description" defaultValue={business?.description ?? ""} className="mt-1" />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <Select label="Category" name="categoryId" defaultValue={business?.categoryId ?? ""} options={categories} />
        <Select label="Town" name="townId" defaultValue={business?.townId ?? ""} options={towns} />
        <Select
          label="Plan"
          name="plan"
          defaultValue={business?.plan ?? "free"}
          options={["free", "starter", "growth", "featured"].map((id) => ({ id, name: id }))}
          allowEmpty={false}
        />
        <Select
          label="Type"
          name="businessType"
          defaultValue={business?.businessType ?? "services"}
          options={["products", "services", "retail", "manufacturer", "wholesale", "b2b", "b2c"].map((id) => ({ id, name: id }))}
          allowEmpty={false}
        />
        <Select
          label="Registration"
          name="registrationStatus"
          defaultValue={business?.registrationStatus ?? "pending"}
          options={["pending", "approved", "rejected"].map((id) => ({ id, name: id }))}
          allowEmpty={false}
        />
        <Select
          label="Listing"
          name="listingStatus"
          defaultValue={business?.listingStatus ?? "pending"}
          options={["pending", "active", "rejected", "suspended"].map((id) => ({ id, name: id }))}
          allowEmpty={false}
        />
      </div>
      <Field label="Address" name="address" defaultValue={business?.address ?? ""} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Phone" name="phone" defaultValue={business?.phone ?? ""} />
        <Field label="WhatsApp" name="whatsapp" defaultValue={business?.whatsapp ?? ""} />
        <Field label="Email" name="email" defaultValue={business?.email ?? ""} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="featured" defaultChecked={business?.featured} /> Featured
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="verified" defaultChecked={business?.verified} /> Verified
      </label>
      <div className="flex gap-2">
        <Button type="submit">Save business</Button>
        {business ? (
          <Button type="submit" variant="destructive" formAction={deleteBusiness}>
            Delete
          </Button>
        ) : null}
      </div>
    </form>
  );
}

export function EventForm({
  event,
  towns,
}: {
  event?: {
    id: string;
    title: string;
    slug: string;
    description: string;
    category: string | null;
    townId: string | null;
    venue: string | null;
    address: string | null;
    startsAt: Date;
    endsAt: Date | null;
    priceLabel: string | null;
    status: string;
    coverUrl: string | null;
  };
  towns: Option[];
}) {
  return (
    <form action={saveEvent} className="grid gap-3 rounded-3xl bg-white p-5">
      {event ? <input type="hidden" name="id" value={event.id} /> : null}
      <Field label="Title" name="title" defaultValue={event?.title} required />
      <Field label="Slug" name="slug" defaultValue={event?.slug} />
      <label className="text-sm font-medium">
        Description
        <Textarea name="description" defaultValue={event?.description ?? ""} className="mt-1" />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Category" name="category" defaultValue={event?.category ?? ""} />
        <Select label="Town" name="townId" defaultValue={event?.townId ?? ""} options={towns} />
        <Field label="Venue" name="venue" defaultValue={event?.venue ?? ""} />
        <Field label="Price label" name="priceLabel" defaultValue={event?.priceLabel ?? ""} />
        <Field label="Starts" name="startsAt" type="datetime-local" defaultValue={toLocal(event?.startsAt)} required />
        <Field label="Ends" name="endsAt" type="datetime-local" defaultValue={toLocal(event?.endsAt)} />
        <Select
          label="Status"
          name="status"
          defaultValue={event?.status ?? "draft"}
          options={["draft", "needs_review", "published", "payment_pending", "paused"].map((id) => ({ id, name: id }))}
          allowEmpty={false}
        />
        <Field label="Cover URL" name="coverUrl" defaultValue={event?.coverUrl ?? ""} />
      </div>
      <Field label="Address" name="address" defaultValue={event?.address ?? ""} />
      <div className="flex gap-2">
        <Button type="submit">Save event</Button>
        {event ? (
          <Button type="submit" variant="destructive" formAction={deleteEvent}>
            Delete
          </Button>
        ) : null}
      </div>
    </form>
  );
}

function Field({ label, ...props }: ComponentProps<"input"> & { label: string }) {
  return (
    <label className="text-sm font-medium">
      {label}
      <Input {...props} className="mt-1" />
    </label>
  );
}

function Select({
  label,
  name,
  defaultValue,
  options,
  allowEmpty = true,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  options: Option[];
  allowEmpty?: boolean;
}) {
  return (
    <label className="text-sm font-medium">
      {label}
      <select name={name} defaultValue={defaultValue ?? ""} className="mt-1 h-11 w-full rounded-2xl border border-[var(--gp-line-strong)] bg-white px-3 text-sm">
        {allowEmpty ? <option value="">—</option> : null}
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </label>
  );
}

function toLocal(value?: Date | null) {
  if (!value) return "";
  const date = new Date(value.getTime() - value.getTimezoneOffset() * 60000);
  return date.toISOString().slice(0, 16);
}
