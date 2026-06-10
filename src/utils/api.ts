/**
 * Sita & Seta API URL and Image formatting utilities
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
  
  // Convert absolute backend uploads into relative paths
  // Supports both localhost:5000 and dynamic production backend URLs
  const backendUrl = typeof window === 'undefined' 
    ? (process.env.BACKEND_URL || 'http://localhost:5000')
    : 'http://localhost:5000'; // fallback client reference (will be stripped by regex/checks if matches origin)

  if (url.startsWith('http://localhost:5000/')) {
    return url.replace('http://localhost:5000/', '/');
  }
  
  // Handle production backend URL matches
  if (process.env.NEXT_PUBLIC_BACKEND_URL && url.startsWith(process.env.NEXT_PUBLIC_BACKEND_URL)) {
    return url.replace(process.env.NEXT_PUBLIC_BACKEND_URL, '');
  }

  // General fallback: if URL has "/uploads/", make it relative so the Next.js rewrite catches it
  if (url.includes('/uploads/')) {
    const uploadsIdx = url.indexOf('/uploads/');
    return url.substring(uploadsIdx);
  }
  
  return url;
};
