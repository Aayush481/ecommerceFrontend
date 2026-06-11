/**
 * Casa dei Regali API URL and Image formatting utilities
 */

export const getApiUrl = (path: string = ''): string => {
  // If running on Next.js server (SSR / SSG), request locally or via environment variable
  if (typeof window === 'undefined') {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    return `${backendUrl}${path}`;
  }
  
  // If running on the client, use relative URL to let Next.js proxy rewrite the port
  return path;
};

export const formatImageUrl = (url: string): string => {
  if (!url) return '';
  
  const trimmed = url.trim();

  // If it's already an absolute URL (starts with http:// or https://), return it as-is.
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  
  // If it contains "/uploads/" somewhere inside, extract the relative path
  if (trimmed.includes('/uploads/')) {
    const uploadsIdx = trimmed.indexOf('/uploads/');
    return trimmed.substring(uploadsIdx);
  }

  // If it's a relative path starting with 'uploads/', prepend a slash
  if (trimmed.startsWith('uploads/')) {
    return `/${trimmed}`;
  }
  
  return trimmed;
};
