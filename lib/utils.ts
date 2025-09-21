
export const getEmbedUrl = (url: string): string | null => {
  if (!url) return null;

  try {
    const urlObject = new URL(url);

    // YouTube
    if (urlObject.hostname.includes('youtube.com') || urlObject.hostname.includes('youtu.be')) {
      let videoId = null;
      if (urlObject.hostname === 'youtu.be') {
        videoId = urlObject.pathname.substring(1);
      } else if (urlObject.pathname === '/watch') {
        videoId = urlObject.searchParams.get('v');
      } else if (urlObject.pathname.startsWith('/embed/')) {
        videoId = urlObject.pathname.substring('/embed/'.length);
      } else if (urlObject.pathname.startsWith('/shorts/')) {
        videoId = urlObject.pathname.substring('/shorts/'.length);
      }
      
      if (videoId) {
        // Validate videoId format
        if (/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
          return `https://www.youtube.com/embed/${videoId}?rel=0`;
        }
      }
    }

    // Google Drive
    if (urlObject.hostname.includes('drive.google.com')) {
      const pathParts = urlObject.pathname.split('/');
      const fileIdIndex = pathParts.indexOf('d');
      if (fileIdIndex > -1 && pathParts.length > fileIdIndex + 1) {
        const fileId = pathParts[fileIdIndex + 1];
        // Basic validation for fileId
        if (fileId && fileId.length > 20) {
            return `https://drive.google.com/file/d/${fileId}/preview`;
        }
      }
    }
    
    // Direct audio/video links
    const path = urlObject.pathname.toLowerCase();
    if (path.endsWith('.mp3') || path.endsWith('.wav') || path.endsWith('.ogg')) {
      return url;
    }
    if (path.endsWith('.mp4') || path.endsWith('.webm') || path.endsWith('.mov')) {
        return url;
    }

  } catch (error) {
    // Invalid URL format
    return null;
  }

  return null; // Not a supported URL
};
