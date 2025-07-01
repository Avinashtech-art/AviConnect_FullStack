import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
// import { createStatus } from '../../store/slices/statusSlice';
import { X, Type, Image, Palette } from 'lucide-react';
import { createStatus } from '../../store/slices/statusSlice';

interface CreateStatusProps {
  onClose: () => void;
  onCreated: () => void;
}

const CreateStatus: React.FC<CreateStatusProps> = ({ onClose, onCreated }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [content, setContent] = useState('');
  const [type, setType] = useState<'text' | 'image'>('text');
  const [backgroundColor, setBackgroundColor] = useState('#1f2937');
  const [textColor, setTextColor] = useState('#ffffff');
  const [isLoading, setIsLoading] = useState(false);

  const backgroundColors = [
    '#1f2937', '#7c3aed', '#dc2626', '#059669', '#d97706', '#0891b2', '#be185d'
  ];

  const textColors = [
    '#ffffff', '#000000', '#fbbf24', '#34d399', '#60a5fa', '#f87171', '#a78bfa'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsLoading(true);
    try {
      await dispatch(createStatus({
        content: content.trim(),
        type,
        backgroundColor: type === 'text' ? backgroundColor : undefined,
        textColor: type === 'text' ? textColor : undefined,
      })).unwrap();
      onCreated();
    } catch (error) {
      console.error('Failed to create status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-900 text-white">
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-700 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold">Add Status</h1>
        <button
          onClick={handleSubmit}
          disabled={!content.trim() || isLoading}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Posting...' : 'Post'}
        </button>
      </div>

      {/* Type Selector */}
      <div className="flex bg-gray-800 text-white">
        <button
          onClick={() => setType('text')}
          className={`flex-1 flex items-center justify-center space-x-2 p-4 ${
            type === 'text' ? 'bg-primary-500' : 'hover:bg-gray-700'
          } transition-colors`}
        >
          <Type className="w-5 h-5" />
          <span>Text</span>
        </button>
        <button
          onClick={() => setType('image')}
          className={`flex-1 flex items-center justify-center space-x-2 p-4 ${
            type === 'image' ? 'bg-primary-500' : 'hover:bg-gray-700'
          } transition-colors`}
        >
          <Image className="w-5 h-5" />
          <span>Photo</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        {type === 'text' ? (
          <div 
            className="w-full max-w-md p-8 rounded-lg"
            style={{ backgroundColor, color: textColor }}
          >
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your status..."
              className="w-full bg-transparent border-none outline-none text-2xl font-medium text-center resize-none placeholder-opacity-50"
              style={{ color: textColor }}
              rows={4}
              maxLength={200}
            />
          </div>
        ) : (
          <div className="w-full max-w-md">
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center text-gray-400">
              <Image className="w-12 h-12 mx-auto mb-4" />
              <p>Tap to add photo</p>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Add a caption..."
              className="w-full mt-4 p-3 bg-gray-800 text-white rounded-lg border-none outline-none resize-none"
              rows={2}
              maxLength={200}
            />
          </div>
        )}
      </div>

      {/* Color Palette for Text Status */}
      {type === 'text' && (
        <div className="bg-gray-900 p-4 text-white">
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Palette className="w-4 h-4" />
              <span className="text-sm font-medium">Background</span>
            </div>
            <div className="flex space-x-2">
              {backgroundColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setBackgroundColor(color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    backgroundColor === color ? 'border-white' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Type className="w-4 h-4" />
              <span className="text-sm font-medium">Text Color</span>
            </div>
            <div className="flex space-x-2">
              {textColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setTextColor(color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    textColor === color ? 'border-white' : 'border-gray-600'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateStatus;