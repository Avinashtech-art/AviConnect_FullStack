import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
// import { fetchCalls, makeCall } from '../../store/slices/callSlice';
import { ArrowLeft, Phone, Video, PhoneCall, PhoneMissed, PhoneIncoming, PhoneOutgoing } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { fetchCalls, makeCall } from '../../store/slices/callSlice';

interface CallHistoryProps {
  onBack: () => void;
}

const CallHistory: React.FC<CallHistoryProps> = ({ onBack }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { calls, isLoading } = useSelector((state: RootState) => state.call);

  useEffect(() => {
    dispatch(fetchCalls());
  }, [dispatch]);

  const getCallIcon = (call: any) => {
    switch (call.status) {
      case 'missed':
        return <PhoneMissed className="w-4 h-4 text-red-500" />;
      case 'answered':
        return call.type === 'video' ? 
          <Video className="w-4 h-4 text-green-500" /> : 
          <PhoneCall className="w-4 h-4 text-green-500" />;
      case 'declined':
        return <PhoneMissed className="w-4 h-4 text-red-500" />;
      default:
        return <Phone className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCallDirection = (Call: any) => {
    // This would be determined based on current user ID
    return Math.random() > 0.5 ? 'outgoing' : 'incoming';
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleCallBack = (receiverId: string, type: 'voice' | 'video') => {
    dispatch(makeCall({ receiverId, type }));
  };

  // Mock call data for demonstration
  const mockCalls = [
    {
      id: '1',
      callerId: 'user1',
      receiverId: 'user2',
      type: 'video',
      status: 'answered',
      duration: 1245,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: '2',
      callerId: 'user2',
      receiverId: 'user1',
      type: 'voice',
      status: 'missed',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
      id: '3',
      callerId: 'user1',
      receiverId: 'user3',
      type: 'voice',
      status: 'answered',
      duration: 567,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  ];

  const callsToShow = calls.length > 0 ? calls : mockCalls;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Calls</h1>
        </div>
      </div>

      {/* Call List */}
      <div className="flex-1 overflow-y-auto">
        {callsToShow.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <PhoneCall className="w-16 h-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No calls yet</p>
            <p className="text-sm">Your call history will appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {callsToShow.map((call) => {
              const direction = getCallDirection(call);
              return (
                <div key={call.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <img
                      src={`https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2`}
                      alt="Contact"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-900">Contact Name</p>
                        {direction === 'incoming' ? (
                          <PhoneIncoming className="w-3 h-3 text-green-500" />
                        ) : (
                          <PhoneOutgoing className="w-3 h-3 text-blue-500" />
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-1">
                        {getCallIcon(call)}
                        <span className="text-sm text-gray-500">
                          {call.status === 'answered' && call.duration
                            ? formatDuration(call.duration)
                            : call.status
                          }
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(call.timestamp), { addSuffix: true })}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleCallBack(call.receiverId, 'voice')}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                        title="Voice call"
                      >
                        <Phone className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleCallBack(call.receiverId, 'video')}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="Video call"
                      >
                        <Video className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CallHistory;