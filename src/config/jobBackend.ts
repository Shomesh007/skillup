// Intentionally public configuration. Database policies permit catalog reads only.
const env:Record<string,string>=import.meta.env||{};
export const jobBackendUrl=env.VITE_SKILLUP_SUPABASE_URL||'https://ljbysmgzqohvlkcdctyj.supabase.co';
export const jobPublishableKey=env.VITE_SKILLUP_SUPABASE_PUBLISHABLE_KEY||'sb_publishable_S2Iy4SJ7I-xRdy3I7j3nog_CDyxmYQN';
