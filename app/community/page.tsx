'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Room {
  id: string;
  name: string;
  participants: number;
}

interface Message {
  id: string;
  roomId: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
}

export default function CommunityPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>(() => sessionStorage.getItem('userId') || '');
  const [username, setUsername] = useState<string>(() => sessionStorage.getItem('username') || '');
  const [isUserSelected, setIsUserSelected] = useState(() => Boolean(sessionStorage.getItem('username')));
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch active rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('/api/community');
        if (!response.ok) throw new Error('Failed to fetch rooms');
        const data = await response.json();
        console.log('Fetched rooms:', data);
        setRooms(data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };
    fetchRooms();
  }, []);

  // Fetch messages when room is selected
  useEffect(() => {
    let isMounted = true;  // Add mounted check
    const fetchMessages = async () => {
      if (!selectedRoom || !isMounted) return;
      
      try {
        const response = await fetch(`/api/community?roomId=${selectedRoom}`);
        if (!response.ok) throw new Error('Failed to fetch messages');
        const data = await response.json();
        
        // Only update if there are new messages to avoid unnecessary re-renders
        setMessages(prevMessages => {
          if (prevMessages.length !== data.length) return data;
          const lastMessage = data[data.length - 1];
          const prevLastMessage = prevMessages[prevMessages.length - 1];
          if (lastMessage?.id !== prevLastMessage?.id) return data;
          return prevMessages;
        });
        
        setError(null);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError('Failed to load messages');
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds instead of 1

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [selectedRoom]);

  const createRoom = async () => {
    if (!newRoomName.trim()) return;
    
    try {
      const response = await fetch('/api/community', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'CREATE_ROOM',
          name: newRoomName,
        }),
      });

      if (!response.ok) throw new Error('Failed to create room');
      const newRoom = await response.json();
      console.log('Created room:', newRoom);
      setRooms(prevRooms => [...prevRooms, newRoom]);
      setNewRoomName('');
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const joinRoom = async (roomId: string) => {
    try {
      const response = await fetch('/api/community', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'UPDATE_PARTICIPANTS',
          roomId,
          change: 1
        }),
      });

      if (!response.ok) throw new Error('Failed to update participants');
      const updatedRoom = await response.json();
      setRooms(prevRooms => 
        prevRooms.map(room => 
          room.id === roomId ? updatedRoom : room
        )
      );
      setSelectedRoom(roomId);
    } catch (error) {
      console.error('Error joining room:', error);
    }
  };

  const leaveRoom = async () => {
    if (!selectedRoom) return;
    
    try {
      const response = await fetch('/api/community', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'UPDATE_PARTICIPANTS',
          roomId: selectedRoom,
          change: -1
        }),
      });

      if (!response.ok) throw new Error('Failed to update participants');
      const updatedRoom = await response.json();
      setRooms(prevRooms => 
        prevRooms.map(room => 
          room.id === selectedRoom ? updatedRoom : room
        )
      );
      setSelectedRoom(null);
      setMessages([]);
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom) return;
    
    try {
      const response = await fetch('/api/community', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'SEND_MESSAGE',
          roomId: selectedRoom,
          userId: userId,
          username: username,
          content: newMessage,
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');
      const newMsg = await response.json();
      console.log('Message sent successfully:', newMsg);
      setMessages(prevMessages => [...prevMessages, newMsg]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  // Add user selection component
  if (!isUserSelected) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-blue-400/30 rounded-full blur-3xl -top-20 -left-20"></div>
          <div className="absolute w-96 h-96 bg-purple-400/30 rounded-full blur-3xl top-40 left-60"></div>
          <div className="absolute w-80 h-80 bg-blue-500/30 rounded-full blur-3xl bottom-0 right-20"></div>
          <div className="absolute w-72 h-72 bg-purple-500/30 rounded-full blur-3xl -right-20 top-10"></div>
          <div className="absolute w-80 h-80 bg-orange-300/30 rounded-full blur-3xl top-0 right-60"></div>
          <div className="absolute w-80 h-80 bg-orange-300/30 rounded-full blur-3xl top-20 left-20"></div>
        </div>
        <div className="bg-white/60 p-6 rounded-lg shadow-lg w-96 z-10">
          <h2 className="text-2xl font-bold mb-4 font-valueSerif pl-2"> Select User
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-outfitRegular pl-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border font-outfitRegular rounded-2xl"
                placeholder="Enter your username"
              />
            </div>
            <button
              onClick={() => {
                if (username.trim()) {
                  const newUserId = `user_${Date.now()}`;
                  setUserId(newUserId);
                  setIsUserSelected(true);
                  sessionStorage.setItem('userId', newUserId);
                  sessionStorage.setItem('username', username);
                }
              }}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-2xl hover:bg-blue-600 font-outfitRegular"
            >
              Join Chat
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 relative">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-400/30 rounded-full blur-3xl -top-20 -left-20"></div>
        <div className="absolute w-96 h-96 bg-purple-400/30 rounded-full blur-3xl top-40 left-60"></div>
        <div className="absolute w-80 h-80 bg-blue-500/30 rounded-full blur-3xl bottom-0 right-20"></div>
        <div className="absolute w-72 h-72 bg-purple-500/30 rounded-full blur-3xl -right-20 top-10"></div>
        <div className="absolute w-80 h-80 bg-orange-300/30 rounded-full blur-3xl top-0 right-60"></div>
        <div className="absolute w-80 h-80 bg-orange-300/30 rounded-full blur-3xl top-20 left-20"></div>
      </div>
      {!selectedRoom ? (
        <div className="max-w-4xl mx-auto relative">
          <h1 className="text-3xl mb-6 font-valueSerif text-slate-700">
            Community Chat Rooms
          </h1>

          {/* Create Room Section */}
          <div className="bg-white/60 p-8 rounded-2xl shadow mb-6">
            <h2 className="text-xl mb-4 font-copernicusMedium text-slate-700">
              Create New Room
            </h2>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="Enter room name"
                  className="w-full p-3 pr-32 border font-outfitRegular rounded-2xl"
                />
                <button
                  onClick={createRoom}
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-violet-500 text-white px-4 py-1.5 rounded-xl font-outfitRegular hover:scale-[1.02] transition-all duration-300 mr-1"
                >
                  Create Room
                </button>
              </div>
            </div>
          </div>

          {/* Active Rooms List */}
          <div className="bg-white/60 rounded-2xl shadow p-8">
            <h2 className="text-xl mb-4 font-copernicusMedium text-slate-700">
              Active Rooms
            </h2>
            <div className="space-y-2">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="flex items-center justify-between border p-3 rounded-2xl hover:bg-purple-400/20 cursor-pointer transition-all duration-300"
                  onClick={() => joinRoom(room.id)}
                >
                  <div>
                    <h3 className="font-medium font-outfitRegular text-slate-700">
                      {room.name}
                    </h3>
                    <p className="text-sm text-gray-500 font-outfitRegular">
                      {room.participants} participants
                    </p>
                  </div>
                  <button className="bg-violet-500 text-white px-4 py-2 rounded-xl font-outfitRegular hover:scale-[1.02] transition-all duration-300">
                    Join
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto relative">
          <div className="bg-white/60 rounded-2xl shadow">
            {/* Chat Room Header */}
            <div className="border-b p-4 flex justify-between items-center">
              <h2 className="text-lg font-outfitRegular bg-violet-200 rounded-full px-4 py-2 text-violet-500">
                {`Room ID: ${
                  rooms.find((r) => r.id === selectedRoom)?.name
                } | ${
                  rooms.find((r) => r.id === selectedRoom)?.participants
                } participants`}
              </h2>
              <button
                onClick={leaveRoom}
                className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 font-outfitRegular"
              >
                Leave Room
              </button>
            </div>

            {/* Messages Section */}
            <div className="h-[67vh] overflow-y-auto p-4 space-y-4">
              {isLoading && (
                <div className="text-center p-4">Loading messages...</div>
              )}
              {error && (
                <div className="text-red-500 text-center p-4">{error}</div>
              )}

              {messages.length === 0 ? (
                <div className="text-center text-gray-400 font-outfitRegular">
                  No messages yet
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex flex-col ${
                      message.userId === userId ? "items-end" : "items-start"
                    }`}
                  >
                    <div className={`flex flex-col ${
                      message.userId === userId ? "items-end" : "items-start"
                    } w-full`}>
                      <span className={`text-xs text-gray-500 mb-1 font-outfitRegular ${
                        message.userId === userId ? "text-right" : "text-left"
                      }`}>
                        {message.username}
                      </span>
                      <div
                        className={`py-2 px-3 rounded-lg text-left whitespace-pre-wrap break-words max-w-[80%] ${
                          message.userId === userId
                            ? "bg-violet-500 text-white ml-auto"
                            : "bg-gray-100"
                        }`}
                      >
                        {message.content}
                      </div>
                      <span className={`text-xs text-gray-500 mt-1 ${
                        message.userId === userId ? "text-right" : "text-left" 
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <div className="relative w-full">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full p-4 pr-20 border rounded-2xl font-outfitRegular focus:ring-1 focus:ring-violet-400 focus:outline-none"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        sendMessage();
                      }
                    }}
                  />
                  <button
                    onClick={sendMessage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-violet-500 text-white px-4 py-1.5 rounded-xl font-outfitRegular hover:scale-[1.02] transition-all duration-300"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}