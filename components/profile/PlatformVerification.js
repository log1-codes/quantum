import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function PlatformVerification({ platform, username, onVerified }) {
  const [verifying, setVerifying] = useState(false);

  const handleVerify = async () => {
    if (!username) {
      toast.error('Please enter a username first');
      return;
    }

    setVerifying(true);
    try {
      const response = await fetch('/api/platforms/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, username })
      });

      const { isValid } = await response.json();
      
      if (isValid) {
        toast.success(`${platform} username verified!`);
        onVerified?.(true);
      } else {
        toast.error(`Invalid ${platform} username`);
        onVerified?.(false);
      }
    } catch (error) {
      toast.error('Verification failed');
      onVerified?.(false);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <button
      onClick={handleVerify}
      disabled={verifying}
      className={`ml-2 px-2 py-1 rounded text-sm ${
        verifying ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'
      }`}
    >
      {verifying ? 'Verifying...' : 'Verify'}
    </button>
  );
}