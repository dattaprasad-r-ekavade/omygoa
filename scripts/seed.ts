import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { hashPassword } from "better-auth/crypto";

async function main() {
const remote = process.argv.includes("--remote");
const password = await hashPassword("GoaDemo!2026");
const now = Date.now();
const day = 86_400_000;

const hours = (closed: string[] = ["sun"], open = "09:00-20:00") => {
  const value: Record<string, string | null> = {};
  for (const key of ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]) {
    value[key] = closed.includes(key) ? null : open;
  }
  return JSON.stringify(value);
};

const q = (value: string | number | boolean | null | undefined) => {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "boolean") return value ? "1" : "0";
  if (typeof value === "number") return String(Math.trunc(value));
  return `'${value.replaceAll("'", "''")}'`;
};

const rows = (table: string, columns: string[], data: (string | number | boolean | null)[][]) => {
  if (data.length === 0) return "";
  const values = data.map((row) => `(${row.map((cell) => q(cell)).join(", ")})`).join(",\n");
  return `INSERT INTO ${table} (${columns.join(", ")}) VALUES\n${values};\n`;
};

const towns = [
  ["town_panaji", "Panaji", "panaji", "north", "15.4909", "73.8278"],
  ["town_mapusa", "Mapusa", "mapusa", "north", "15.5915", "73.8088"],
  ["town_calangute", "Calangute", "calangute", "north", "15.5439", "73.7553"],
  ["town_candolim", "Candolim", "candolim", "north", "15.5181", "73.7626"],
  ["town_anjuna", "Anjuna", "anjuna", "north", "15.5736", "73.7407"],
  ["town_vagator", "Vagator", "vagator", "north", "15.5978", "73.7340"],
  ["town_assagao", "Assagao", "assagao", "north", "15.5944", "73.7770"],
  ["town_porvorim", "Porvorim", "porvorim", "north", "15.5300", "73.8270"],
  ["town_aldona", "Aldona", "aldona", "north", "15.5930", "73.8740"],
  ["town_siolim", "Siolim", "siolim", "north", "15.6170", "73.7660"],
  ["town_morjim", "Morjim", "morjim", "north", "15.6300", "73.7350"],
  ["town_arambol", "Arambol", "arambol", "north", "15.6869", "73.7040"],
  ["town_bicholim", "Bicholim", "bicholim", "north", "15.5860", "73.9450"],
  ["town_oldgoa", "Old Goa", "old-goa", "north", "15.5030", "73.9120"],
  ["town_dona", "Dona Paula", "dona-paula", "north", "15.4550", "73.8050"],
  ["town_miramar", "Miramar", "miramar", "north", "15.4830", "73.8090"],
  ["town_saligao", "Saligao", "saligao", "north", "15.5530", "73.7900"],
  ["town_margao", "Margao", "margao", "south", "15.2832", "73.9862"],
  ["town_vasco", "Vasco", "vasco", "south", "15.3981", "73.8113"],
  ["town_colva", "Colva", "colva", "south", "15.2797", "73.9220"],
  ["town_benaulim", "Benaulim", "benaulim", "south", "15.2644", "73.9283"],
  ["town_palolem", "Palolem", "palolem", "south", "15.0100", "74.0232"],
  ["town_agonda", "Agonda", "agonda", "south", "15.0444", "73.9880"],
  ["town_canacona", "Canacona", "canacona", "south", "15.0167", "74.0167"],
  ["town_cavelossim", "Cavelossim", "cavelossim", "south", "15.1720", "73.9410"],
  ["town_majorda", "Majorda", "majorda", "south", "15.3110", "73.9300"],
  ["town_varca", "Varca", "varca", "south", "15.2320", "73.9430"],
  ["town_quepem", "Quepem", "quepem", "south", "15.2127", "74.0777"],
  ["town_cuncolim", "Cuncolim", "cuncolim", "south", "15.1760", "73.9930"],
  ["town_ponda", "Ponda", "ponda", "south", "15.4030", "74.0150"],
  ["town_chandor", "Chandor", "chandor", "south", "15.2660", "74.0530"],
] as const;

const categories = [
  ["cat_food", "Food & Dining", "food-dining", 1],
  ["cat_stays", "Hotels & Stays", "hotels-stays", 2],
  ["cat_wellness", "Wellness & Spa", "wellness-spa", 3],
  ["cat_retail", "Retail", "retail", 4],
  ["cat_health", "Healthcare", "healthcare", 5],
  ["cat_auto", "Automotive", "automotive", 6],
  ["cat_edu", "Education", "education", 7],
  ["cat_home", "Home services", "home-services", 8],
  ["cat_pro", "Professional services", "professional", 9],
  ["cat_night", "Nightlife", "nightlife", 10],
  ["cat_tours", "Tours", "tours", 11],
  ["cat_wed", "Weddings", "weddings", 12],
] as const;

const users = [
  ["user_admin", "Asha Kamat", "admin@example.com", "admin", "+919000000001"],
  ["user_owner", "Rohan Naik", "owner@example.com", "owner", "+919000000002"],
  ["user_manager", "Meera D'Souza", "manager@example.com", "manager", "+919000000003"],
  ["user_customer", "Kabir Shenoy", "customer@example.com", "customer", "+919000000004"],
  ["user_lila", "Lila Fernandes", "lila@example.com", "owner", "+919000000005"],
] as const;

const standard = hours();
const cafe = hours([], "07:30-18:00");
const night = hours(["mon"], "17:00-23:30");

const businesses: (string | number | boolean | null)[][] = [
  ["biz_spice", "user_owner", "Palolem Spice Kitchen", "palolem-spice-kitchen", "Home-style fish curry and a shaded lunch counter.", "A small kitchen two lanes back from Palolem beach. The lunch plate changes with the catch, and the verandah stays open through the monsoon with a shorter menu.", "cat_food", "town_palolem", "Lane 3, behind the south beach path, Palolem", "+919000000011", "+919000000011", "spice@example.com", null, standard, "15.0104", "74.0235", "growth", 1, 1, "approved", "active", "retail", 0, 1, 0, 0, 1, "/goa/promotions/goa-local-business.webp", now - 40 * day],
  ["biz_ink", "user_owner", "Fontainhas Ink Studio", "fontainhas-ink-studio", "Print, binding and small-run invitations.", "A first-floor studio in São Tomé that prints menus, wedding cards and the odd poetry chapbook. Walk-ins before noon get the same-day tray.", "cat_retail", "town_panaji", "12 São Tomé lane, Fontainhas, Panaji", "+919000000012", "+919000000012", "ink@example.com", null, hours(["sun"]), "15.4985", "73.8318", "featured", 1, 1, "approved", "active", "retail", 0, 1, 1, 0, 1, "/goa/lane/fontainhas-street-420.webp", now - 80 * day],
  ["biz_cafe", "user_lila", "Mandovi Morning Cafe", "mandovi-morning-cafe", "Filter coffee and a window seat on the river.", "Opens with the first ferry. Bakers start at 5, the counter closes when the evening light hits the Mandovi.", "cat_food", "town_panaji", "Riverfront road, near the old jetty, Panaji", "+919000000013", "+919000000013", "morning@example.com", null, cafe, "15.5010", "73.8265", "starter", 1, 1, "approved", "active", "retail", 1, 1, 1, 1, 1, "/goa/promotions/goa-discovery.webp", now - 20 * day],
  ["biz_spa", "user_lila", "Calangute Wave Spa", "calangute-wave-spa", "Quiet rooms a short walk from the sand.", "Four treatment rooms and a cold-water rinse. Appointments run on the hour. Children are welcome in the garden, not in the treatment rooms.", "cat_wellness", "town_calangute", "Holiday street, Calangute", "+919000000014", "+919000000014", "wave@example.com", null, hours(["tue"]), "15.5460", "73.7570", "growth", 0, 1, "approved", "active", "services", 1, 0, 1, 0, 1, null, now - 15 * day],
  ["biz_clay", "user_lila", "Assagao Clay & Linen", "assagao-clay-linen", "Tableware and washed linen from a back garden.", "A shed studio selling stoneware and a small rack of linen. Saturday mornings include a paid wheel session.", "cat_retail", "town_assagao", "Club house lane, Assagao", "+919000000015", "+919000000015", "clay@example.com", null, hours(["mon"]), "15.5950", "73.7780", "free", 0, 0, "approved", "active", "products", 1, 1, 0, 1, 1, "/goa/lane/aguada-beetle-420.webp", now - 9 * day],
  ["biz_rooms", "user_owner", "Colva Coast Rooms", "colva-coast-rooms", "Four rooms above a family house.", "Simple rooms with a shared verandah. No front desk after 9 pm; message ahead if the train is late.", "cat_stays", "town_colva", "Second left from the beach road, Colva", "+919000000016", "+919000000016", "rooms@example.com", null, hours([]), "15.2805", "73.9180", "starter", 0, 1, "approved", "active", "services", 0, 1, 0, 0, 1, "/goa/page-art/adopt-goa-beach-1600.webp", now - 50 * day],
  ["biz_tailor", "user_lila", "Mapusa Market Tailors", "mapusa-market-tailors", "Alterations while you finish the market.", "Two machines and a measuring tape at the Friday market edge. Same-day hems before 1 pm.", "cat_retail", "town_mapusa", "Market lane, Mapusa", "+919000000017", "+919000000017", "tailor@example.com", null, hours(["sun"], "08:00-14:00"), "15.5910", "73.8100", "free", 0, 0, "approved", "active", "services", 1, 1, 0, 0, 1, null, now - 6 * day],
  ["biz_records", "user_lila", "Anjuna Sunset Records", "anjuna-sunset-records", "Used records and a quiet listening corner.", "A crate shop that opens when the light drops. Listening is free if you put the sleeve back.", "cat_night", "town_anjuna", "Market road, Anjuna", "+919000000018", "+919000000018", "records@example.com", null, night, "15.5745", "73.7415", "free", 0, 0, "approved", "active", "retail", 0, 1, 0, 1, 0, null, now - 3 * day],
  ["biz_pending", "user_lila", "Saligao Home Visits", "saligao-home-visits", "Nurse visits for dressings and blood pressure.", "Awaiting registration review. Not on the public directory yet.", "cat_health", "town_saligao", "Feira Alta, Saligao", "+919000000019", "+919000000019", "visits@example.com", null, hours(["sun"]), "15.5540", "73.7890", "free", 0, 0, "pending", "pending", "services", 1, 1, 0, 0, 1, null, now - 1 * day],
];

const sql = `
PRAGMA foreign_keys = OFF;
DELETE FROM saved_businesses;
DELETE FROM notifications;
DELETE FROM ad_campaigns;
DELETE FROM billing_records;
DELETE FROM job_applications;
DELETE FROM enquiries;
DELETE FROM reviews;
DELETE FROM business_photos;
DELETE FROM jobs;
DELETE FROM rentals;
DELETE FROM preloved_items;
DELETE FROM pet_adoptions;
DELETE FROM services;
DELETE FROM events;
DELETE FROM businesses;
DELETE FROM blog_posts;
DELETE FROM coupons;
DELETE FROM subscription_plans;
DELETE FROM settings;
DELETE FROM session;
DELETE FROM account;
DELETE FROM verification;
DELETE FROM user;
DELETE FROM towns;
DELETE FROM categories;
PRAGMA foreign_keys = ON;

${rows("towns", ["id", "name", "slug", "region", "lat", "lng"], towns.map((row) => [...row]))}
${rows(
  "categories",
  ["id", "name", "slug", "group_name", "sort"],
  categories.map((row) => [row[0], row[1], row[2], "directory", row[3]]),
)}
${rows(
  "user",
  ["id", "name", "email", "email_verified", "created_at", "updated_at", "role", "phone_number", "phone_number_verified"],
  users.map((row) => [row[0], row[1], row[2], 1, now, now, row[3], row[4], 1]),
)}
${rows(
  "account",
  ["id", "account_id", "provider_id", "user_id", "password", "created_at", "updated_at"],
  users.map((row) => [`acct_${row[0]}`, row[0], "credential", row[0], password, now, now]),
)}
${rows(
  "businesses",
  ["id", "owner_user_id", "name", "slug", "tagline", "description", "category_id", "town_id", "address", "phone", "whatsapp", "email", "website", "hours_json", "lat", "lng", "plan", "featured", "verified", "registration_status", "listing_status", "business_type", "woman_owned", "local_goan", "wheelchair_accessible", "pet_friendly", "family_friendly", "cover_url", "created_at", "updated_at"],
  businesses.map((row) => [...row, now]),
)}
${rows("business_photos", ["id", "business_id", "url", "alt", "sort"], [
  ["photo_spice", "biz_spice", "/goa/promotions/goa-local-business.webp", "Lunch counter illustration", 0],
  ["photo_ink", "biz_ink", "/goa/lane/fontainhas-street-420.webp", "A Fontainhas lane", 0],
])}
${rows("reviews", ["id", "business_id", "user_id", "author_name", "rating", "body", "status", "created_at"], [
  ["rev_1", "biz_spice", "user_customer", "Kabir Shenoy", 5, "The prawn curry was the sort you hope a beach lunch still is.", "approved", now - 5 * day],
  ["rev_2", "biz_cafe", null, "Anika Pednekar", 4, "Went for one coffee and stayed for the second ferry.", "approved", now - 4 * day],
  ["rev_3", "biz_ink", null, "Dev Sharma", 5, "They printed our menu without making it look like a template.", "approved", now - 12 * day],
  ["rev_4", "biz_spa", null, "Nina Kulkarni", 3, "Lovely room, the wait ran long on a Saturday.", "pending", now - 2 * day],
])}
${rows("enquiries", ["id", "business_id", "user_id", "name", "email", "phone", "message", "status", "created_at"], [
  ["enq_1", "biz_spice", "user_customer", "Kabir Shenoy", "customer@example.com", "+919000000004", "Do you keep a table for six on Friday evening?", "new", now - 2 * day],
  ["enq_2", "biz_rooms", null, "Tara Lotlikar", "tara@example.com", "+919000000020", "Is the upstairs room free the first weekend of December?", "read", now - 8 * day],
])}
${rows(
  "events",
  ["id", "organizer_user_id", "business_id", "title", "slug", "description", "category", "town_id", "venue", "address", "starts_at", "ends_at", "cover_url", "price_label", "status", "qr_token", "created_at", "updated_at"],
  [
    ["evt_jazz", "user_owner", "biz_cafe", "Courtyard Jazz at Casa Azul", "courtyard-jazz-casa-azul", "A four-piece plays two sets in a Fontainhas courtyard. Seats are cushions. The cafe next door keeps a short snack menu.", "Music", "town_panaji", "Casa Azul courtyard", "São Tomé, Fontainhas", now + 6 * day + 18 * 3600_000, now + 6 * day + 21 * 3600_000, "/goa/advertise/social-feature.webp", "₹400 at the gate", "published", "qr_jazz", now, now],
    ["evt_coffee", "user_lila", "biz_cafe", "Saturday Founders Coffee", "saturday-founders-coffee", "Eight seats, one question each, no pitches longer than the time it takes the coffee to cool.", "Meetup", "town_panaji", "Mandovi Morning Cafe", "Riverfront road, Panaji", now + 3 * day + 9 * 3600_000, now + 3 * day + 11 * 3600_000, "/goa/advertise/homepage-featured.webp", "Free, book a seat", "published", "qr_coffee", now, now],
    ["evt_clay", "user_lila", "biz_clay", "Clay and Chai", "clay-and-chai", "A two-hour wheel session with chai afterwards. Aprons are here. Closed shoes help.", "Workshop", "town_assagao", "Assagao Clay & Linen", "Club house lane, Assagao", now + 10 * day + 10 * 3600_000, now + 10 * day + 12 * 3600_000, null, "₹900", "published", "qr_clay", now, now],
    ["evt_canvas", "user_owner", null, "Coast and Canvas", "coast-and-canvas", "Paint the morning light at Colva. Materials included, shade is not guaranteed.", "Workshop", "town_colva", "Colva beach entrance", "Beach road, Colva", now + 12 * day + 7 * 3600_000, now + 12 * day + 9 * 3600_000, "/goa/page-art/adopt-goa-beach-1600.webp", "₹700", "published", "qr_canvas", now, now],
    ["evt_vinyl", "user_lila", "biz_records", "Monsoon Vinyl Night", "monsoon-vinyl-night", "Bring one record, play two songs. Still waiting on a sound check before it is published.", "Music", "town_anjuna", "Anjuna Sunset Records", "Market road, Anjuna", now + 20 * day + 19 * 3600_000, null, null, "₹200", "needs_review", "qr_vinyl", now, now],
  ],
)}
${rows(
  "jobs",
  ["id", "user_id", "business_id", "title", "slug", "description", "town_id", "category", "workplace", "job_type", "salary_label", "status", "created_at"],
  [
    ["job_host", "user_lila", "biz_cafe", "Cafe host for the morning shift", "cafe-host-morning-shift", "Greet the first ferry crowd, keep the window counter clear, and learn the coffee list. Six mornings a week.", "town_panaji", "Hospitality", "on-site", "full-time", "₹18,000 / month", "open", now - 4 * day],
    ["job_spa", "user_lila", "biz_spa", "Spa therapist", "spa-therapist-calangute", "A trained therapist for Swedish and a short Ayurvedic menu. Certificate required. Two weekdays off.", "town_calangute", "Wellness", "on-site", "full-time", "₹25,000 / month", "open", now - 7 * day],
    ["job_tailor", "user_lila", "biz_tailor", "Alterations assistant", "alterations-assistant-mapusa", "Help with hems on market days and learn the machines the rest of the week.", "town_mapusa", "Retail", "on-site", "part-time", "₹700 / day", "open", now - 2 * day],
    ["job_photo", "user_customer", null, "Weekend photographer for beach gatherings", "weekend-photographer-beach", "A seasonal contract for small beach gatherings. Own camera. Evenings and Sundays.", "town_benaulim", "Events", "on-site", "contract", "₹3,500 / day", "open", now - day],
  ],
)}
${rows("job_applications", ["id", "job_id", "user_id", "name", "email", "phone", "note", "status", "created_at"], [
  ["app_1", "job_host", "user_customer", "Kabir Shenoy", "customer@example.com", "+919000000004", "I can start after the monsoon school break.", "received", now - day],
])}
${rows(
  "rentals",
  ["id", "user_id", "title", "slug", "description", "town_id", "kind", "price_label", "furnished", "status", "cover_url", "created_at"],
  [
    ["rent_car", "user_customer", "Compact hatchback for weekend drives", "compact-hatchback-weekend", "A maintained hatchback with a full tank policy and a helmet-free boot for beach bags. Pickup in Panaji.", "town_panaji", "car", "₹1,800 / day", 0, "available", null, now - 3 * day],
    ["rent_scooter", "user_lila", "Automatic scooter with a helmet", "automatic-scooter-candolim", "One 110cc scooter, two helmets, and a phone mount. Return it with the same smile.", "town_candolim", "scooter", "₹500 / day", 0, "available", null, now - 2 * day],
    ["rent_room", "user_owner", "Sunny room near Margao station", "sunny-room-margao-station", "A furnished room in a family house, ten minutes from the station. Shared kitchen, no parties.", "town_margao", "room", "₹9,000 / month", 1, "available", null, now - 11 * day],
    ["rent_flat", "user_lila", "Two-bedroom flat in Dona Paula", "two-bedroom-dona-paula", "A bright flat with a river glimpse. Available for a six-month stay. Pets after a hello.", "town_dona", "house", "₹32,000 / month", 1, "available", "/goa/featured-listings-panel.webp", now - 14 * day],
  ],
)}
${rows(
  "preloved_items",
  ["id", "user_id", "title", "slug", "description", "town_id", "category", "price_label", "is_free", "status", "cover_url", "created_at"],
  [
    ["item_camera", "user_customer", "Used mirrorless camera with a spare lens", "used-mirrorless-camera", "A few years of careful use, one extra lens, and the original strap. Battery holds a morning of shooting.", "town_panaji", "Electronics", "₹28,000", 0, "available", null, now - 5 * day],
    ["item_guitar", "user_lila", "Acoustic guitar for a new hobby", "acoustic-guitar-hobby", "Plays in tune. A small scratch on the back. Includes a soft case.", "town_margao", "Books & Sports", "₹4,500", 0, "available", null, now - 6 * day],
    ["item_pots", "user_owner", "Window herb pots", "window-herb-pots", "Three clay pots and a bag of soil. Free if you can carry them down the stairs.", "town_mapusa", "Home & Garden", "Free", 1, "available", null, now - day],
    ["item_laptop", "user_customer", "Everyday 13-inch laptop", "everyday-13-inch-laptop", "Good for writing and classes. Battery lasts about four hours. Charger included.", "town_porvorim", "Electronics", "₹18,000", 0, "available", null, now - 9 * day],
  ],
)}
${rows(
  "pet_adoptions",
  ["id", "user_id", "name", "slug", "species", "breed", "age_label", "sex", "vaccinated", "description", "personality", "town_id", "status", "cover_url", "created_at"],
  [
    ["pet_bruno", "user_customer", "Bruno", "bruno", "dog", "Indie", "3 years", "male", "yes", "Bruno watches the gate and then pretends he was never worried. He is house-trained and walks nicely once the first ten minutes are done.", "Calm, loyal, fond of ceiling fans.", "town_margao", "available", "/goa/page-art/adopt-duo-720.webp", now - 4 * day],
    ["pet_misty", "user_lila", "Misty", "misty", "cat", "Indian shorthair", "2 years", "female", "yes", "Misty arrived in a monsoon and decided the bookshelf was hers. She prefers a quiet flat to a busy shop.", "Independent, soft in the evenings.", "town_panaji", "available", null, now - 3 * day],
    ["pet_olive", "user_owner", "Olive", "olive", "dog", "Indie", "8 years", "female", "yes", "Olive is a senior who would like a courtyard and one person who is home most days.", "Gentle, sleeps early.", "town_mapusa", "available", null, now - 8 * day],
    ["pet_coco", "user_lila", "Coco", "coco", "dog", "Indie", "6 months", "male", "yes", "Coco is still learning that slippers are not toys. He has had his first vaccines and a lot of practice at being cheerful.", "Playful, people-focused.", "town_colva", "available", null, now - 2 * day],
  ],
)}
${rows(
  "services",
  ["id", "business_id", "title", "slug", "description", "town_id", "category", "price_from", "phone", "status", "created_at"],
  [
    ["svc_electric", "biz_ink", "Home electrical visits", "home-electrical-visits", "Fans, boards and the odd stubborn switch. Visits across Panaji and Porvorim on weekday mornings.", "town_panaji", "Home services", 400, "+919000000012", "active", now],
    ["svc_wedding", null, "Beach gathering planning", "beach-gathering-planning", "A small team that sets chairs, a simple menu and a playlist for gatherings under forty people.", "town_benaulim", "Weddings", 15000, "+919000000021", "active", now],
    ["svc_scooter", null, "Scooter servicing at your lane", "scooter-servicing-lane", "Oil, brakes and a once-over. The van comes to Candolim, Calangute and Anjuna.", "town_candolim", "Automotive", 700, "+919000000022", "active", now],
    ["svc_translate", null, "Shop signs in Hindi and English", "shop-signs-hindi-english", "Short menus and shop boards written clearly in both languages, delivered as a print-ready file.", "town_margao", "Professional", 1200, "+919000000023", "active", now],
  ],
)}
${rows(
  "blog_posts",
  ["id", "slug", "title", "excerpt", "body", "author_name", "status", "published_at", "created_at"],
  [
    ["post_monsoon", "a-monsoon-weekend-in-south-goa", "A monsoon weekend in South Goa", "What still feels worth the wet road between Margao and Palolem.", "The monsoon does not cancel South Goa. It changes the speed of it.\n\nStart in Margao before the market shuts for lunch, then take the coast road only if the sky looks decided. Palolem in the rain is mostly verandahs and a shorter menu, which is the point.\n\nCarry a light layer. The cafes that stay open are the ones worth knowing in December too.", "Asha Kamat", "published", now - 10 * day, now - 10 * day],
    ["post_guesthouse", "how-to-list-a-guesthouse", "How to list a guesthouse", "The few details guests actually use before they write to you.", "A listing works when a guest can tell, in one screen, where you are and how to reach a person.\n\nPut the lane, not just the village. Add the hours you really answer the phone. A single honest photo of the room beats a collage.\n\nThe free plan is enough to start. Featuring is for the weeks you actually have rooms empty.", "OmyGoa", "published", now - 6 * day, now - 6 * day],
    ["post_mapusa", "eating-around-mapusa-market", "Eating around the Mapusa market", "A short loop that does not require a plan.", "Go early. The best snacks are gone before the heat, and the tailors are still cheerful.\n\nEat something fried, then something with coconut, then leave before you buy a second bag of bananas.\n\nIf you are listing a stall, say which morning you are actually there.", "Lila Fernandes", "published", now - 2 * day, now - 2 * day],
  ],
)}
${rows("coupons", ["id", "code", "description", "percent_off", "amount_off_inr", "active", "expires_at", "created_at"], [
  ["cpn_hello", "GOAHELLO", "A welcome note for the first paid year.", 20, null, 1, now + 180 * day, now],
  ["cpn_wave", "WAVE500", "₹500 off a growth plan. Demo code, not yet applied at checkout.", null, 500, 1, now + 90 * day, now],
])}
${rows("subscription_plans", ["id", "slug", "name", "price_inr", "interval", "blurb", "features_json", "highlighted", "sort"], [
  ["plan_free", "free", "Free", 0, "year", "A public page and an enquiry button.", '["Public listing","Enquiry form","Opening hours"]', 0, 1],
  ["plan_starter", "starter", "Starter", 2499, "year", "For a single place that wants a verified badge.", '["Everything in Free","Verified badge","Photo gallery"]', 0, 2],
  ["plan_growth", "growth", "Growth", 4999, "year", "The plan most cafes and stays pick.", '["Everything in Starter","Featured rotation","Leads export"]', 1, 3],
  ["plan_featured", "featured", "Featured", 8999, "year", "Stay at the top of explore for the season.", '["Everything in Growth","Homepage spotlight","Ad placement credit"]', 0, 4],
])}
${rows("billing_records", ["id", "user_id", "business_id", "plan_id", "amount_inr", "currency", "status", "provider", "provider_ref", "description", "created_at"], [
  ["bill_1", "user_owner", "biz_spice", "plan_growth", 4999, "INR", "paid", "razorpay", "order_demo_growth_001", "Growth (year)", now - 30 * day],
  ["bill_2", "user_owner", "biz_rooms", "plan_starter", 2499, "INR", "paid", "razorpay", "order_demo_starter_002", "Starter (year)", now - 40 * day],
])}
${rows("ad_campaigns", ["id", "user_id", "business_id", "placement", "title", "status", "budget_inr", "starts_at", "ends_at", "created_at"], [
  ["ad_1", "user_owner", "biz_ink", "explore-top", "Fontainhas Ink on explore", "active", 3000, now - 7 * day, now + 21 * day, now - 7 * day],
  ["ad_2", "user_lila", "biz_spa", "category-top", "Wave Spa in wellness", "pending", 2000, null, null, now - day],
])}
${rows("notifications", ["id", "user_id", "title", "body", "kind", "read", "created_at"], [
  ["note_1", "user_owner", "Listing approved", "Palolem Spice Kitchen is live on the directory.", "info", 1, now - 39 * day],
  ["note_2", "user_owner", "New enquiry", "Kabir asked about a Friday table.", "lead", 0, now - 2 * day],
  ["note_3", "user_admin", "Registration waiting", "Saligao Home Visits is in the review queue.", "info", 0, now - day],
])}
${rows("saved_businesses", ["user_id", "business_id", "created_at"], [
  ["user_customer", "biz_spice", now - 3 * day],
  ["user_customer", "biz_cafe", now - 2 * day],
  ["user_customer", "biz_ink", now - day],
])}
${rows("settings", ["key", "value"], [
  ["coming_soon_title", "OmyGoa is open"],
  ["coming_soon_body", "The public directory is live. New tools land in later releases."],
  ["support_note", "Write to hello@omygoa.in. This inbox is the public contact, not a personal mailbox from the old site."],
])}
`;

const file = new URL("./seed.generated.sql", import.meta.url);
writeFileSync(file, sql);
const flag = remote ? "--remote" : "--local";
execSync(`npx wrangler d1 execute omygoa ${flag} --file=${file.pathname}`, {
  stdio: "inherit",
  cwd: new URL("..", import.meta.url),
});
console.log(remote ? "Remote D1 seeded." : "Local D1 seeded. Demo password: GoaDemo!2026");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
