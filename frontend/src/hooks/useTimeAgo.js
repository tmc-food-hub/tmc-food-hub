import { useState, useEffect } from 'react';

export const useTimeAgo = (publicationDate) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const formatPubDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'long', day: 'numeric', year: 'numeric' 
    });
  };

  const pubDate = new Date(publicationDate);
  const diffInMs = now - pubDate;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  let timeDisplay = '';
  if (diffInMinutes < 1) timeDisplay = 'Just now';
  else if (diffInMinutes < 60) timeDisplay = `${diffInMinutes} ${diffInMinutes === 1 ? 'min' : 'mins'} ago`;
  else if (diffInHours < 24) timeDisplay = `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  else if (diffInDays < 30) timeDisplay = `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  else timeDisplay = formatPubDate(publicationDate);

  return {
    timeDisplay,
    fullDate: formatPubDate(publicationDate)
  };
};