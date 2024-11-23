import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddChannelModal from './Addchannel';
import ImageModal from './ImageModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import styles

const PaymentChannels = () => {
  const [channels, setChannels] = useState([]);
  const [selectedType, setSelectedType] = useState('E-Wallet');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showImage, setShowImage] = useState(null);
  const [channelToUpdate, setChannelToUpdate] = useState(null);

  useEffect(() => {
    fetchChannels(selectedType);
  }, [selectedType]);

  const fetchChannels = async (type) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/channels/type/${type}`);
      setChannels(response.data);
    } catch (error) {
      console.error('Failed to fetch channels:', error);
      toast.error('Failed to fetch channels.');
    }
  };

  const handleAddChannel = () => {
    setChannelToUpdate(null); // Clear update data
    setIsModalOpen(true); // Open modal for new channel
  };

  const openUpdateModal = (channel) => {
    setChannelToUpdate(channel); // Set data for update
    setIsModalOpen(true); // Open modal
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setChannelToUpdate(null); // Clear modal state
  };

  const handleDeleteChannel = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/admin/channels/${id}`);
      toast.success('Channel deleted successfully!');
      fetchChannels(selectedType); // Refresh channels after deletion
    } catch (error) {
      console.error('Failed to delete channel:', error);
      toast.error('Failed to delete channel.');
    }
  };

  return (
    <div className="bg-gray-700 text-white p-6 space-y-6">
      <ToastContainer />
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Payment Channels</h1>
        <button
          className="bg-orange-500 px-4 py-2 rounded-lg font-bold transform transition-transform hover:scale-95"
          onClick={handleAddChannel}
        >
          Add Channel
        </button>
      </div>

      {/* Channel Type Buttons */}
      <div className="flex space-x-4">
        {['E-Wallet', 'Paytm X QR', 'UPI X QR', 'USDT'].map((type) => (
          <button
            key={type}
            className={`px-4 py-2 rounded-lg font-bold transform transition-transform hover:scale-95 ${
              selectedType === type ? 'bg-orange-500' : 'bg-gray-800'
            }`}
            onClick={() => setSelectedType(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Channel List */}
      <div className="bg-gray-800 rounded-lg p-4">
        <table className="min-w-full text-sm text-gray-400">
          <thead className="bg-gray-700 text-gray-200">
            <tr>
              <th className="px-4 py-2">Channel Name</th>
              <th className="px-4 py-2">Depositor ID</th>
              <th className="px-4 py-2">Balance</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {channels.map((channel) => (
              <tr key={channel._id} className="bg-gray-700 text-gray-200 text-center">
                <td className="px-4 py-2">{channel.channelName}</td>
                <td className="px-4 py-2">{channel.depositorId}</td>
                <td className="px-4 py-2">
                  {channel.fromBalance} - {channel.toBalance}
                </td>
                <td className="px-4 py-2 space-x-2">
                {channel.qrImage && ( // Conditionally show the "View" button
              <button
                className="bg-orange-500 px-2 py-1 rounded-lg font-bold text-sm transform transition-transform hover:scale-95"
                onClick={() => setShowImage(channel.qrImage)}
              >
                View
              </button>
            )}
                  <button
                    className="bg-blue-500 px-2 py-1 rounded-lg font-bold text-sm transform transition-transform hover:scale-95"
                    onClick={() => openUpdateModal(channel)}
                  >
                    Update
                  </button>
                  <button
                    className="bg-red px-2 py-1 rounded-lg font-bold text-sm transform transition-transform hover:scale-95"
                    onClick={() => handleDeleteChannel(channel._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="min-h-screen">
      <AddChannelModal
        isOpen={isModalOpen}
        onClose={closeModal}
        channelToUpdate={channelToUpdate}
        onAddChannel={() => fetchChannels(selectedType)}
        setChannelToUpdate={setChannelToUpdate}
      />
      <ImageModal
        imageUrl={showImage ? `${import.meta.env.VITE_BASE_URL}/images/${showImage}` : null}
        onClose={() => setShowImage(null)}
      />
      </div>
    </div>
  );
};

export default PaymentChannels;
