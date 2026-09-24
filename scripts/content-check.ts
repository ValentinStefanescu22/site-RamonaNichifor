/**
 * `npm run content:check` – lists what content is still missing (links, covers, contact
 * details…). It never fails the build: the site works with placeholders meanwhile.
 * Schema errors, on the other hand, DO fail (they're thrown by the loader).
 */
import { getContent } from '../src/lib/data/local/load';

const { site, profile, books, universes, products, artworks } = getContent();
const todo: string[] = [];

// Contact & social
if (!profile.contact.whatsapp)
  todo.push('profile: WhatsApp number (content/profile.ts → contact.whatsapp)');
if (!profile.contact.email) todo.push('profile: e-mail address (contact.email)');
if (!profile.social.instagram) todo.push('profile: Instagram URL (social.instagram)');
if (!profile.social.facebook) todo.push('profile: Facebook URL (social.facebook)');
if (!profile.legal)
  todo.push(
    'profile: legal details, if Ramona sells directly (legal) – confirm with an accountant',
  );
if (site.baseUrl.includes('pages.dev')) todo.push('site: final domain (content/site.ts → baseUrl)');

// Books & universes
for (const b of books) {
  if (!b.cover) todo.push(`book ${b.id}: cover image`);
  if (b.status === 'published' && !b.editions.some((e) => e.publisher))
    todo.push(`book ${b.id}: publisher`);
}
for (const u of universes) {
  if (u.status === 'coming_soon') todo.push(`universe ${u.id}: story text (coming soon for now)`);
}

// Products
for (const p of products) {
  if (p.images.length === 0 && p.status !== 'coming_soon') todo.push(`product ${p.id}: photo`);
  for (const o of p.purchaseOptions) {
    if (o.kind === 'external_retailer' && !o.url)
      todo.push(`product ${p.id}: ${o.retailerId} link`);
  }
}
if (artworks.length === 0) todo.push('artworks: photos and details of originals and prints');

console.log(todo.length ? `Missing content (${todo.length}):\n` : 'All content complete.');
for (const line of todo) console.log(`  • ${line}`);
