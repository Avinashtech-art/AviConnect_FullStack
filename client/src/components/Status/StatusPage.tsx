import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
// import { fetchStatuses, fetchMyStatuses, createStatus, deleteStatus, viewStatus } from '../../store/slices/statusSlice';
import { Plus, Eye, Trash2, ArrowLeft } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
// import StatusViewer from './StatusViewer';
import CreateStatus from './CreateStatus';
import StatusViewer from './StatusViewer';
import { deleteStatus, fetchMyStatuses, fetchStatuses, viewStatus } from '../../store/slices/statusSlice';

interface StatusPageProps {
  onBack: () => void;
}

const StatusPage: React.FC<StatusPageProps> = ({ onBack }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { statuses, myStatuses, isLoading } = useSelector((state: RootState) => state.status);
  const { user } = useSelector((state: RootState) => state.auth);
  const [showCreateStatus, setShowCreateStatus] = useState(false);
  const [viewingStatus, setViewingStatus] = useState<any>(null);
  const [showMyStatusViews, setShowMyStatusViews] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchStatuses());
    dispatch(fetchMyStatuses());
  }, [dispatch]);

  const handleViewStatus = (status: any) => {
    if (status.userId !== user?.id) {
      dispatch(viewStatus({ statusId: status.id, userId: user!.id }));
    }
    setViewingStatus(status);
  };

  const handleDeleteStatus = (statusId: string) => {
    dispatch(deleteStatus(statusId));
  };

  if (viewingStatus) {
    return (
      <StatusViewer
        status={viewingStatus}
        onClose={() => setViewingStatus(null)}
      />
    );
  }

  if (showCreateStatus) {
    return (
      <CreateStatus
        onClose={() => setShowCreateStatus(false)}
        onCreated={() => {
          setShowCreateStatus(false);
          dispatch(fetchMyStatuses());
        }}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Status</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* My Status */}
        <div className="bg-white border-b border-gray-200">
          <div className="p-4">
            <h2 className="text-sm font-medium text-gray-700 mb-3">My Status</h2>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <button
                  onClick={() => setShowCreateStatus(true)}
                  className="absolute bottom-0 right-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">My Status</p>
                <p className="text-sm text-gray-500">
                  {myStatuses.length > 0 
                    ? `${myStatuses.length} status${myStatuses.length > 1 ? 'es' : ''}`
                    : 'Tap to add status update'
                  }
                </p>
              </div>
            </div>

            {/* My Status List */}
            {myStatuses.length > 0 && (
              <div className="mt-4 space-y-2">
                {myStatuses.map((status) => (
                  <div
                    key={status.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => handleViewStatus(status)}
                    >
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {status.content}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(status.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowMyStatusViews(showMyStatusViews === status.id ? null : status.id)}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                        title={`${status.viewers.length} views`}
                      >
                        <Eye className="w-4 h-4 text-gray-500" />
                        <span className="text-xs text-gray-500 ml-1">
                          {status.viewers.length}
                        </span>
                      </button>
                      <button
                        onClick={() => handleDeleteStatus(status.id)}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Updates */}
        <div className="bg-white">
          <div className="p-4">
            <h2 className="text-sm font-medium text-gray-700 mb-3">Recent Updates</h2>
            {statuses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No status updates yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {statuses.map((status) => (
                  <div
                    key={status.id}
                    onClick={() => handleViewStatus(status)}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="relative">
                      <img
                        src={`https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2`}
                        alt="User"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="absolute inset-0 rounded-full border-2 border-primary-500"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">Contact Name</p>
                      <p className="text-sm text-gray-500 truncate">
                        {status.content}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(status.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusPage;