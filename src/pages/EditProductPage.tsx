import React from "react";
import { LuImagePlus } from "react-icons/lu";
import { RiArrowRightSLine } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
// Breadcrumb component
const Breadcrumb = () => (
  <nav
    className="mb-6 px-8 text-gray-700 text-sm"
    style={{ fontFamily: "Poppins" }}
    aria-label="Breadcrumb"
  >
    <ol className="list-reset flex">
      <li>
        <a href="/dashboard/seller-dashboard" className="text-black-600">
          Home
        </a>
      </li>
      <li className="flex items-center">
        <RiArrowRightSLine className="mx-2 text-slate-500" />
      </li>
      <li>
        <a href="/dashboard/products" className="text-black-600">
          Products
        </a>
      </li>
      <li className="flex items-center">
        <RiArrowRightSLine className="mx-2 text-slate-500" />
      </li>
      <li className="text-gray-500">Edit Product</li>
    </ol>
  </nav>
);

const EditProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { productNo } = useParams();

  return (
    <div className="min-h-screen py-1 font-poppins" style={{ fontFamily: "Poppins" }}>
      <Breadcrumb />
      <div className="w-full mx-auto bg-white shadow rounded-lg p-8">
        <h2 className="text-xl font-semibold mb-6">Edit Product</h2>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block font-medium mb-1">Product Title *</label>
            <input type="text" className="w-full border px-3 py-2 rounded" value="The product title" />
          </div>
          <div>
            <label className="block font-medium mb-1">Price</label>
            <input type="text" className="w-full border px-3 py-2 rounded" value="$499" />
          </div>
          <div>
            <label className="block font-medium mb-1">Discount in %</label>
            <input type="text" className="w-full border px-3 py-2 rounded" value="10%" />
          </div>
          <div>
            <label className="block font-medium mb-1">Mood</label>
            <select className="w-full border px-3 py-2 rounded">
              <option>Happy</option>
              {/* add options */}
            </select>
          </div>
        </div>
        <div className="mb-6">
          <label className="block font-medium mb-2">Video</label>
          <div className="relative w-full max-h-64">
            <img
              src="https://cdn.cness.io/collection1.svg"
              alt="video"
              className="w-full max-h-64 rounded object-cover"
            />
            <LuImagePlus
              className="absolute top-1/2 left-1/2 text-5xl text-white drop-shadow -translate-x-1/2 -translate-y-1/2"
              style={{ pointerEvents: "none" }}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block font-medium mb-1">Overview</label>
            <textarea
              className="w-full border px-3 py-2 font-semibold rounded resize-none"
              rows={5}
              defaultValue="Take a few moments to slow down, breathe deeply, and reconnect with yourself. This guided meditation helps you release tension, calm your mind, and find inner balance. Whether you’re starting your day or winding down, let this peaceful session bring clarity and stillness. Close your eyes, relax, and let the calm flow through you..."
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Highlights</label>
            <ul className="list-disc pl-8 text-gray-700 text-sm w-full border px-3 py-2 rounded">
              <li>Guided relaxation for stress relief</li>
              <li>Mindfulness and breathing techniques</li>
              <li>Restores focus and emotional balance</li>
            </ul>
          </div>
          <div>
            <label className="block font-medium mb-1">Duration</label>
            <input className="w-full border px-3 py-2 rounded" value="15 Mins" />
          </div>
          <div>
            <label className="block font-medium mb-1">Language</label>
            <select className="w-full border px-3 py-2 rounded">
              <option>English</option>
            </select>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Storytelling</h3>
          <div className="grid grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-xs text-gray-500 font-poppins">Short video</p>
              <p className="text-xs text-gray-500 font-poppins">Add a quick video to explain what your original content is about</p>
              <img
                src="https://cdn.cness.io/collection1.svg"
                alt="short video"
                className="rounded-lg object-cover mb-2 mt-2"
              />
            </div>
            <div>
              <label className="block font-normal mb-1">Summary of the video</label>
              <textarea
                className="w-full border px-3 py-2 rounded font-poppins font-semibold resize-none"
                rows={5}
                defaultValue="Take a few moments to slow down, breathe deeply, and reconnect with yourself. This guided meditation helps you release tension, calm your mind, and find inner balance. Whether you’re starting your day or winding down, let this peaceful session bring clarity and stillness. Close your eyes, relax, and let the calm flow through you..."
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-10">
          <button className="text-gray-500 border px-6 py-2 rounded hover:bg-gray-100">Discard</button>
          {/* Correct navigation with proper string interpolation */}
          <button
            className="bg-[#7077FE] text-white px-6 py-2 rounded"
            onClick={() => navigate(`/dashboard/products/preview/${productNo}`)}
          >
            Preview
          </button>
          <button className="bg-[#7077FE] text-white px-6 py-2 rounded">Save</button>
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;
