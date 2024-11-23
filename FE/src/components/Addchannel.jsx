import { toast } from 'react-toastify';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddChannelModal = ({ isOpen, onClose, channelToUpdate, onAddChannel, setChannelToUpdate }) => {
  const [channelName, setChannelName] = useState('');
  const [type, setType] = useState('E-Wallet');
  const [depositorId, setDepositorId] = useState('');
  const [fromBalance, setFromBalance] = useState('');
  const [toBalance, setToBalance] = useState('');
  const [qrImage, setQrImage] = useState(null);

  useEffect(() => {
    if (channelToUpdate) {
      // Populate fields for updating
      setChannelName(channelToUpdate.channelName);
      setType(channelToUpdate.type);
      setDepositorId(channelToUpdate.depositorId);
      setFromBalance(channelToUpdate.fromBalance);
      setToBalance(channelToUpdate.toBalance);
    } else {
      // Reset fields for adding a new channel
      setChannelName('');
      setType('E-Wallet');
      setDepositorId('');
      setFromBalance('');
      setToBalance('');
      setQrImage(null);
    }
  }, [channelToUpdate]);



  useEffect(() => {
    if (!isOpen) {
      setChannelToUpdate(null);
    }
  }, [isOpen, setChannelToUpdate]);

  
  const handleSubmit = async () => {
    if (!channelName || !type || !depositorId || !fromBalance || !toBalance) {
      toast.error('Please fill all the fields.');
      return;
    }
  
    try {
      // Use FormData only if `qrImage` is included.
      const formData = new FormData();
      formData.append('channelName', channelName);
      formData.append('type', type);
      formData.append('depositorId', depositorId);
      formData.append('fromBalance', fromBalance);
      formData.append('toBalance', toBalance);
  
      if (qrImage) {
        formData.append('qrImage', qrImage);
      }
  
      if (channelToUpdate) {
        // Update API
        const updatedData = qrImage ? formData : {
          channelName,
          type,
          depositorId,
          fromBalance,
          toBalance,
        };
  
        await axios.put(
          `${import.meta.env.VITE_BASE_URL}/admin/channels/${channelToUpdate._id}`,
          qrImage ? formData : updatedData,
          { headers: qrImage ? { 'Content-Type': 'multipart/form-data' } : {} }
        );
  
        toast.success('Channel updated successfully!');
        onAddChannel(); // Fetch new channels after adding
      } else {
        // Add API
        await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/channels`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
  
        toast.success('Channel added successfully!');
        onAddChannel(); // Fetch new channels after adding
        setChannelToUpdate(null)
      }
  
      onClose(); // Close modal after operation
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again.');
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
      <div className="bg-gray-800 text-white rounded-lg p-6 w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold">{channelToUpdate ? "Update Channel" : "Add New Channel"}</h2>

        <div className="space-y-3">
          <label className="block">
            <span className="text-gray-300">Channel Name</span>
            <input
              type="text"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded border border-gray-500 focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="text-gray-300">Type</span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded border border-gray-500 focus:outline-none"
            >
              {["E-Wallet", "Paytm X QR", "UPI X QR", "USDT"].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-gray-300">Depositor ID</span>
            <input
              type="text"
              value={depositorId}
              onChange={(e) => setDepositorId(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded border border-gray-500 focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="text-gray-300">From Balance</span>
            <input
              type="text"
              value={fromBalance}
              onChange={(e) => setFromBalance(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded border border-gray-500 focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="text-gray-300">To Balance</span>
            <input
              type="text"
              value={toBalance}
              onChange={(e) => setToBalance(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded border border-gray-500 focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="text-gray-300">QR Image</span>
            <input
              type="file"
              onChange={(e) => setQrImage(e.target.files[0])}
              className="w-full text-sm text-gray-300"
            />
          </label>
        </div>


        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 rounded-lg font-bold transform hover:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-orange-500 rounded-lg font-bold transform hover:scale-95"
          >
            {channelToUpdate ? "Update Channel" : "Add Channel"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddChannelModal;
