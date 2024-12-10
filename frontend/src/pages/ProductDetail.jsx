import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Heart, Share2, Star } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
    const API_URL = process.env.REACT_APP_API_URL; 

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await fetch(`${API_URL}/api/products/${id}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch product: ${response.statusText}`);
                }
                const data = await response.json();
                setProduct({
                    ...data,
                    // 添加示例图片数组，实际项目中应该从API获取
                    images: [
                        data.image_url,
                        '/assets/images/product-2.jpg',
                        '/assets/images/product-3.jpg',
                        '/assets/images/product-4.jpg'
                    ],
                    // 添加示例规格，实际项目中应该从API获取
                    specifications: {
                        'Dimensions': '10 x 20 x 5 cm',
                        'Weight': '500g',
                        'Material': 'Premium Quality',
                        'Warranty': '12 months'
                    },
                    // 添加示例评价，实际项目中应该从API获取
                    reviews: [
                        { id: 1, user: 'John Doe', rating: 5, comment: 'Excellent product!', date: '2024-03-01' },
                        { id: 2, user: 'Jane Smith', rating: 4, comment: 'Good quality but a bit pricey.', date: '2024-02-28' }
                    ]
                });
            } catch (err) {
                setError(err.message || 'An error occurred while fetching product details.');
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [id, API_URL]);

    const handleQuantityChange = (change) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && newQuantity <= product.stock) {
            setQuantity(newQuantity);
        }
    };

    const showNotification = (message) => {
        setAlertMessage(message);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
    };

    const handleAddToCart = () => {
        if (product.stock < quantity) {
            showNotification('Not enough stock available.');
            return;
        }

        addToCart({ ...product, quantity });
        showNotification(`${product.name} has been added to your cart.`);
    };

    const handleBuyNow = () => {
        if (product.stock < quantity) {
            showNotification('Not enough stock available.');
            return;
        }

        addToCart({ ...product, quantity });
        navigate('/checkout');
    };

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
        showNotification(isFavorite ? 'Removed from favorites' : 'Added to favorites');
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        showNotification('Product link copied to clipboard!');
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

    const renderReviewStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <Star
                key={index}
                className={`w-4 h-4 ${index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            />
        ));
    };

    return (
        <section className="py-10 bg-gray-100">
            {showAlert && (
                <Alert className="fixed top-4 right-4 w-72 z-50">
                    <AlertDescription>{alertMessage}</AlertDescription>
                </Alert>
            )}
            
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* 图片展示区域 */}
                    <div className="space-y-4">
                        <div className="aspect-w-1 aspect-h-1 w-full">
                            <img
                                src={product.images[selectedImage] || '/assets/images/placeholder.png'}
                                alt={product.name}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {product.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`aspect-w-1 aspect-h-1 ${
                                        selectedImage === index ? 'ring-2 ring-blue-500' : ''
                                    }`}
                                >
                                    <img
                                        src={image}
                                        alt={`${product.name} view ${index + 1}`}
                                        className="w-full h-full object-cover rounded"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 产品信息区域 */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-start">
                            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
                            <div className="flex space-x-2">
                                <button
                                    onClick={toggleFavorite}
                                    className={`p-2 rounded-full ${
                                        isFavorite ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-500'
                                    }`}
                                >
                                    <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="p-2 rounded-full bg-gray-100 text-gray-500"
                                >
                                    <Share2 className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <p className="text-3xl font-bold text-gray-800">${product.price}</p>

                        <div className="flex items-center space-x-4">
                            <p className={`text-sm ${product.stock > 0 ? 'text-gray-500' : 'text-red-500'}`}>
                                Stock: {product.stock > 0 ? product.stock : 'Out of stock'}
                            </p>
                            {product.stock > 0 && (
                                <div className="flex items-center border rounded">
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        className="px-3 py-1 border-r hover:bg-gray-100"
                                    >
                                        -
                                    </button>
                                    <span className="px-4 py-1">{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        className="px-3 py-1 border-l hover:bg-gray-100"
                                    >
                                        +
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex space-x-4">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
                                disabled={product.stock < 1}
                            >
                                Add to Cart
                            </button>
                            <button
                                onClick={handleBuyNow}
                                className="flex-1 px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
                                disabled={product.stock < 1}
                            >
                                Buy Now
                            </button>
                        </div>

                        <Tabs defaultValue="description" className="w-full">
                            <TabsList>
                                <TabsTrigger value="description">Description</TabsTrigger>
                                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                            </TabsList>

                            <TabsContent value="description" className="mt-4">
                                <p className="text-gray-600">{product.description}</p>
                            </TabsContent>

                            <TabsContent value="specifications" className="mt-4">
                                <dl className="space-y-2">
                                    {Object.entries(product.specifications).map(([key, value]) => (
                                        <div key={key} className="grid grid-cols-2">
                                            <dt className="text-gray-600">{key}</dt>
                                            <dd className="text-gray-900">{value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </TabsContent>

                            <TabsContent value="reviews" className="mt-4">
                                <div className="space-y-4">
                                    {product.reviews.map((review) => (
                                        <div key={review.id} className="border-b pb-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-semibold">{review.user}</span>
                                                    <div className="flex">
                                                        {renderReviewStars(review.rating)}
                                                    </div>
                                                </div>
                                                <span className="text-sm text-gray-500">{review.date}</span>
                                            </div>
                                            <p className="mt-2 text-gray-600">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ProductDetails;