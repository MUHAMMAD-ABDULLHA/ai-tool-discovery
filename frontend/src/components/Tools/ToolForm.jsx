import React, { useState } from "react";

const ToolForm = ({ onSubmit, token }) => {
  const [form, setForm] = useState({
    name: "",
    logo: "",
    category: "",
    description: "",
    pricing: "",
    useCases: "",
    link: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Split useCases by comma
    const formattedData = {
      ...form,
      useCases: form.useCases.split(",").map((u) => u.trim()),
    };
    onSubmit(formattedData, token); // 🔑 pass token here
  };

  return (
    <div className="min-h-screen bg-background py-10 px-6">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-neutral-dark mb-6">
          Add New Tool
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Tool Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">
              Tool Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. ChatGPT"
            />
          </div>

          {/* Logo */}
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">
              Logo URL
            </label>
            <input
              type="text"
              name="logo"
              value={form.logo}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://example.com/logo.png"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="AI Assistant"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Short description of the tool..."
            ></textarea>
          </div>

          {/* Pricing */}
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">
              Pricing
            </label>
            <input
              type="text"
              name="pricing"
              value={form.pricing}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Free / Subscription / One-time"
            />
          </div>

          {/* Use Cases */}
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">
              Use Cases (comma separated)
            </label>
            <input
              type="text"
              name="useCases"
              value={form.useCases}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. Content creation, Marketing, Research"
            />
          </div>

          {/* Link */}
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">
              Tool Link
            </label>
            <input
              type="url"
              name="link"
              value={form.link}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://example.com"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition"
          >
            Save Tool
          </button>
        </form>
      </div>
    </div>
  );
};

export default ToolForm;
