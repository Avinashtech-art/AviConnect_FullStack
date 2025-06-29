import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface StatusViewerProps {
  status: any;
  onClose: () => void;
}

const StatusViewer: React.FC<StatusViewerProps> = ({ status, onClose }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          onClose();
          return 0;
        }
        return prev + 1;
      });
    }, 50); // 5 seconds total

    return () => clearInterval(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-600">
        <div 
          className="h-full bg-white transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white">
        <div className="flex items-center space-x-3">
          <img
            src={`https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2`}
            alt="User"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-medium">Contact Name</p>
            <p className="text-sm text-gray-300">
              {formatDistanceToNow(new Date(status.timestamp), { addSuffix: true })}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-700 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Status Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        {status.type === 'text' ? (
          <div 
            className="text-center p-8 rounded-lg max-w-md"
            style={{ 
              backgroundColor: status.backgroundColor || '#1f2937',
              color: status.textColor || '#ffffff'
            }}
          >
            <p className="text-2xl font-medium leading-relaxed">
              {status.content}
            </p>
          </div>
        ) : (
          <img
            src={status.mediaUrl}
            alt="Status"
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between p-4">
        <button className="p-3 text-white hover:bg-gray-700 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button className="p-3 text-white hover:bg-gray-700 rounded-full transition-colors">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default StatusViewer;