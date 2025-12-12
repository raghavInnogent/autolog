import React, { useEffect, useState } from 'react';
import { prematureAPI } from '../services/api';

const PrematureItemsModal = ({ onClose }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await prematureAPI.getAllForUser();
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching premature items:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group items by vehicleName
  const groupedItems = items.reduce((acc, item) => {
    const vehicle = item.vehicleName || 'Unknown Vehicle';
    if (!acc[vehicle]) {
      acc[vehicle] = [];
    }
    acc[vehicle].push(item);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" style={{ backdropFilter: 'blur(5px)' }}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Premature Service Items</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No premature service items found.
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedItems).map(([vehicleName, vehicleItems]) => (
                <div key={vehicleName} className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-lg text-indigo-700 mb-3 border-b border-gray-200 pb-2">
                    {vehicleName}
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {vehicleItems.map((item, index) => (
                      <div key={index} className="bg-white p-3 rounded shadow-sm border border-gray-100 flex justify-between items-center">
                        <span className="font-medium text-gray-700">{item.categoryName}</span>
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold">
                          Count: {item.prematureCount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrematureItemsModal;