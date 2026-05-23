import { useState } from "react";
import { X } from "lucide-react";

const CategoryModal = ({ onClose, onSubmit, categories }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const handleSelect = (category) => {
    const categoryName = typeof category === 'string' ? category : category.name;
    const categoryId = typeof category === 'string' ? category : category._id;
    setSelectedCategories(prev => 
      prev.includes(categoryName) 
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
    setSelectedIds(prev => 
      prev.includes(categoryId) 
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one category");
      return;
    }
    onSubmit(selectedIds);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-96 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Select Interests</h2>
            <p className="text-sm text-gray-500 mt-1">Choose your favorite categories</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {categories.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {categories.map(cat => {
                const categoryName = typeof cat === 'string' ? cat : cat.name;
                const isSelected = selectedCategories.includes(categoryName);
                
                return (
                  <label
                    key={categoryName}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition border-2 ${
                      isSelected
                        ? 'bg-blue-50 border-blue-500'
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelect(cat)}
                      className="w-5 h-5 text-blue-600 rounded cursor-pointer"
                    />
                    <span className={`text-sm font-medium ${
                      isSelected ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                      {categoryName}
                    </span>
                  </label>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-500 text-sm mt-4">Loading categories...</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 space-y-3 bg-gray-50">
          {selectedCategories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map(cat => (
                <span
                  key={cat}
                  className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
                >
                  {cat}
                  <X size={14} className="cursor-pointer" onClick={() => handleSelect(cat)} />
                </span>
              ))}
            </div>
          )}
          <button
            onClick={handleSubmit}
            disabled={selectedCategories.length === 0}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold transition-all"
          >
            Continue ({selectedCategories.length} selected)
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;