export const VALIDITY_DAYS = 365;
export const WARN_DAYS = 30;

const key = (a: string) => `sp-verified-at:${a}`;

export function saveVerification(address: string) {
  try {
    localStorage.setItem(key(address), String(Date.now()));
  } catch {}
}

export function getVerifiedAt(address: string): number | null {
  try {
    const v = localStorage.getItem(key(address));
    return v ? Number(v) : null;
  } catch {
    return null;
  }
}