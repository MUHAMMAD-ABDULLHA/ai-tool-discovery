// src/components/ToolList.jsx

import React from 'react';
import useToolStore from '../store/ToolStore';
import useTools from '../hooks/Tools';
import { Link } from 'react-router-dom';

const ToolList = () => {
  const { filteredTools, loading, error } = useTools();
  const { categories, selectedCategory, setSelectedCategory } = useToolStore();

  if (loading) return <div className="text-center p-8">Loading tools...</div>;
  if (error) return <div className="text-center p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-8">AI Tool Discovery</h1>

      {/* Category Filter Section */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full font-medium transition-colors duration-200
              ${selectedCategory === category
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600'
              }`}
          >
            {category.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Tool Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredTools.length > 0 ? (
          filteredTools.map((tool) => (
            <div key={tool._id} className="bg-white rounded-xl shadow-md overflow-hidden p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <img src={tool.logo} alt={`${tool.name} logo`} className="w-12 h-12 rounded-full mr-4 object-cover" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{tool.name}</h2>
                  <p className="text-sm text-gray-500">{tool.category.replace('_', ' ')}</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-3">{tool.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {tool.useCases.map((useCase, index) => (
                  <span key={index} className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {useCase}
                  </span>
                ))}
              </div>
              <div className="text-sm text-gray-500">
                <p><strong>Pricing:</strong> {tool.pricing}</p>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <a 
                  href={tool.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-block bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Visit Tool
                </a>
                <Link to={`/tools/${tool._id}`} className="text-indigo-600 text-sm font-medium hover:underline">
                  View Reviews &rarr;
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No tools found for this category.</p>
        )}
      </div>
    </div>
  );
};

export default ToolList;