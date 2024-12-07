function FeaturedProducts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((item) => (
        <div key={item} className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Featured Product {item}</h3>
            <p className="text-gray-600 mb-4">Description of this amazing product goes here.</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Learn More
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}