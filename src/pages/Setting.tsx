import React, { useState } from "react";
import { UpdatePasswordDetails } from "../Common/ServerAPI";

const Setting = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    const payload = {
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    };

    try {
      const res = await UpdatePasswordDetails(payload);

      // Safely access response
      if (res && res.success && res.success.message) {
        setMessage(res.success.message);
      } else {
        setMessage("Password updated successfully.");
      }
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error:", error);
      setMessage("An error occurred while updating the password.");
    }

    // Reset fields
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };
return (
  <div className="w-full h-full px-4 py-10 md:px-8 bg-[#f9f9f9]">
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-6 sm:p-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Change Password
      </h2>

      {message && (
        <p className="mb-4 text-sm text-green-600 font-medium">{message}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-md hover:opacity-90 transition disabled:opacity-50"
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
  </div>
);
};

export default Setting;
