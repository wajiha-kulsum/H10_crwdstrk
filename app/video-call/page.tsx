'use client';

import { useState } from 'react';
import VideoCall from '@/myComponents/VideoCall';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function VideoCallPage() {
  const [userId, setUserId] = useState('');
  const [callId, setCallId] = useState('');
  const [isCallStarted, setIsCallStarted] = useState(false);

  const startCall = () => {
    if (userId && callId) {
      setIsCallStarted(true);
    }
  };

  if (isCallStarted) {
    return <VideoCall userId={userId} callId={callId} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Start Video Call</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">User ID</label>
            <Input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your user ID"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Call ID</label>
            <Input
              type="text"
              value={callId}
              onChange={(e) => setCallId(e.target.value)}
              placeholder="Enter call ID"
              className="w-full"
            />
          </div>
          <Button
            onClick={startCall}
            className="w-full"
            disabled={!userId || !callId}
          >
            Join Call
          </Button>
        </div>
      </div>
    </div>
  );
} 