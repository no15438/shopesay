import React from 'react';

function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: 'John Doe',
      text: 'Great shopping experience! The products are top-notch.',
    },
    {
      id: 2,
      name: 'Jane Smith',
      text: 'Fast delivery and amazing customer support!',
    },
  ];

  return (
    <div className="bg-gray-100 py-8">
      <h3 className="text-center text-3xl font-bold mb-6">What Our Customers Say</h3>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map(({ id, name, text }) => (
          <div key={id} className="p-6 bg-white shadow rounded">
            <p className="text-lg text-gray-700 mb-4">"{text}"</p>
            <p className="text-right text-gray-500">- {name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Testimonials;