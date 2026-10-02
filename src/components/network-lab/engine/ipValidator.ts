export function isValidIPv4(ip: string): boolean {
  if (!ip || typeof ip !== 'string') return false;
  const trimmed = ip.trim();
  const parts = trimmed.split('.');
  if (parts.length !== 4) return false;
  return parts.every((part) => {
    if (!/^\d+$/.test(part)) return false;
    const num = parseInt(part, 10);
    return num >= 0 && num <= 255 && (part === '0' || !part.startsWith('0'));
  });
}

export function isValidIPv6(ip: string): boolean {
  if (!ip || typeof ip !== 'string') return false;
  const trimmed = ip.trim();
  if (trimmed.length < 2 || trimmed.length > 39) return false;

  // Check double colon
  const doubleColonCount = (trimmed.match(/::/g) || []).length;
  if (doubleColonCount > 1) return false;

  if (trimmed === '::') return true;

  if (doubleColonCount === 1) {
    const [left, right] = trimmed.split('::');
    const leftParts = left ? left.split(':') : [];
    const rightParts = right ? right.split(':') : [];
    if (leftParts.length + rightParts.length > 7) return false;

    const allParts = [...leftParts, ...rightParts];
    return allParts.every((part) => /^[0-9a-fA-F]{1,4}$/.test(part));
  }

  const parts = trimmed.split(':');
  if (parts.length !== 8) return false;
  return parts.every((part) => /^[0-9a-fA-F]{1,4}$/.test(part));
}

export function isValidSubnet(mask: string): boolean {
  if (!mask) return false;
  const trimmed = mask.trim();
  if (/^\/\d+$/.test(trimmed)) {
    const cidr = parseInt(trimmed.substring(1), 10);
    return cidr >= 0 && cidr <= 32;
  }
  const validOctets = [0, 128, 192, 224, 240, 248, 252, 254, 255];
  const parts = trimmed.split('.');
  if (parts.length !== 4) return false;
  return parts.every((p) => /^\d+$/.test(p) && validOctets.includes(parseInt(p, 10)));
}

export function isValidPrefix(prefix: number | string): boolean {
  const num = typeof prefix === 'string' ? parseInt(prefix, 10) : prefix;
  return !isNaN(num) && num >= 1 && num <= 128;
}

export function synthesizeNat64IPv6(ipv4: string): string {
  // RFC 6052 Well-Known Prefix: 64:ff9b::/96
  const cleanIpv4 = (ipv4 || '198.51.100.25').trim();
  return `64:ff9b::${cleanIpv4}`;
}
