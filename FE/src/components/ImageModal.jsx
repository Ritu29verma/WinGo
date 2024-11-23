

const ImageModal = ({ imageUrl, onClose }) => {
    if (!imageUrl) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="relative bg-gray-800 p-4 rounded-lg max-w-lg w-full">
          <button
            className="absolute top-2 right-2 text-white bg-red-500 rounded-full px-2 py-1 text-xs font-bold"
            onClick={onClose}
          >
            X
          </button>
          <img
            src={imageUrl}
            alt="QR"
            className="max-w-full max-h-full mx-auto rounded-lg"
          />
        </div>
      </div>
    );
  };

export default ImageModal;