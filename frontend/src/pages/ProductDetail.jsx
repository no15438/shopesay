import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ProductDetails() {
    const { id } = useParams(); // 获取产品 ID
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                console.log(`Fetching product details for ID: ${id}`);
                const response = await fetch(`${API_URL}/api/products/${id}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch product: ${response.statusText}`);
                }
                const data = await response.json();
                console.log('Fetched product details:', data);
                setProduct(data);
            } catch (err) {
                console.error('Error fetching product details:', err);
                setError(err.message || 'An error occurred while fetching product details.');
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [id, API_URL]);

    const handleAddToCart = () => {
        console.log(`Adding product ID ${product.id} to cart...`);
        // Mock function to simulate adding to cart
        alert(`${product.name} has been added to your cart.`);
    };

    const handleBuyNow = () => {
        console.log(`Purchasing product ID ${product.id}...`);
        // Mock function to simulate purchase action
        alert(`You have purchased ${product.name}. Redirecting to checkout...`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                <p className="ml-4 text-blue-500 font-semibold">Loading product details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 text-center font-semibold">
                <p>Error: {error}</p>
                <p>Please try refreshing the page or check back later.</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-gray-600 text-center font-semibold">
                <p>Product not found.</p>
            </div>
        );
    }

    return (
        <section className="py-10 bg-gray-100">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">{product.name}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <img
                        src={product.image_url || '/assets/images/placeholder.png'}
                        alt={product.name}
                        className="w-full h-auto rounded"
                    />
                    <div>
                        <p className="text-lg text-gray-600 mb-4">{product.description}</p>
                        <p className="text-2xl font-bold text-gray-800 mb-4">${product.price}</p>
                        <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                        <div className="mt-6 flex space-x-4">
                            <button
                                onClick={handleAddToCart}
                                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            >
                                Add to Cart
                            </button>
                            <button
                                onClick={handleBuyNow}
                                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ProductDetails;