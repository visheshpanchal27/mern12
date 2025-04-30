const Modal = ({ isOpen, onClose, value, setValue, handleUpdate, handleDelete }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        {/* Background Overlay */}
        <div className="fixed inset-0 bg-black opacity-60" onClick={onClose}></div>
  
        {/* Modal Box - Dark Theme */}
        <div className="relative bg-gray-900 text-white p-8 rounded-lg shadow-lg w-96 min-h-[40px]">

          {/* Close Button */}
          <button 
            className="absolute top-1 right-2 text-gray-400 hover:text-white focus:outline-none"
            onClick={onClose}
          >
            ✕
          </button>

          {/* Modal Content */}
          <div className="space-y-4">
            {/* Input Field */}
            <input 
              type="text" 
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-white focus:outline-none"
              placeholder="Edit category name"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />

            {/* Buttons */}
            <div className="flex justify-between">
              <button 
                className="bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 focus:ring-2 focus:ring-pink-400"
                onClick={handleUpdate}
              >
                Update
              </button>
              <button 
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-400"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
};

export default Modal;
