import type { APIRoute } from 'astro';
import { getConfig, saveConfig } from '../../lib/db.js';

export const prerender = false;

export const get: APIRoute = async () => {
  const config = await getConfig();
  return new Response(JSON.stringify(config), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const post: APIRoute = async ({ request }) => {
  const payload = await request.json();
  const config = await saveConfig(payload);
  return new Response(JSON.stringify({ success: true, config }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
