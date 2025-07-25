import { useState } from "react";

const Managebestpractices = () => {
  const [activeTab, setActiveTab] = useState<'saved' | 'mine'>('saved');

  return (
    <div className="w-full min-h-screen mt-8">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6 mt-8">
        <button
          className={`px-4 py-2 cursor-pointer font-medium ${activeTab === 'saved' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('saved')}
        >
          Saved Best Practices
        </button>
        <button
          className={`px-4 py-2 cursor-pointer font-medium ${activeTab === 'mine' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('mine')}
        >
          My Best Practices 
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'mine' && (
        <div className="min-h-screen bg-white p-6 font-sans">
<h3 className="font-[Poppins] font-medium text-[18px] leading-[150%] tracking-normal mb-4">
  View My Best Practices
</h3>          <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Best Practices Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Best Practices Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Best Practices Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operations</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Practice 1</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Description for practice 1</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Image Placeholder</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Edit | Delete</td>
                </tr>
                {/* Add more static rows as needed */}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="min-h-screen bg-white p-6 font-sans">
          <h3 className="font-[Poppins] font-medium text-[18px] leading-[150%] tracking-normal mb-4">View Saved Best Practices</h3>
         
          <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Best Practices Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Best Practices Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Best Practices Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Practice 1</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Description for practice 1</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Image Placeholder</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Edit | Delete</td>
                </tr>
                {/* Add more static rows as needed */}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Managebestpractices;
