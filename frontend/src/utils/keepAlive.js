const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const startKeepAlive = () => {
  const ping = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/auth/health`);
      console.log('Keep-alive ping sent');
    } catch {
      console.log('Backend sleeping, ping failed');
    }
  };

  ping(); // immediate ping on load
  const interval = setInterval(ping, 14 * 60 * 1000); // every 14 minutes
  return () => clearInterval(interval);
};