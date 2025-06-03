
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Search, Menu, X, Plus, Minus, Star, Heart, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';

const SAMPLE_PRODUCTS = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    category: "Electronics",
    rating: 4.8,
    reviews: 124,
    image: "Premium wireless headphones with noise cancellation",
    description: "Experience crystal-clear audio with our premium wireless headphones featuring active noise cancellation.",
    inStock: true,
    featured: true
  },
  {
    id: 2,
    name: "Luxury Leather Wallet",
    price: 89.99,
    category: "Accessories",
    rating: 4.9,
    reviews: 89,
    image: "Elegant leather wallet in brown",
    description: "Handcrafted genuine leather wallet with RFID protection and multiple card slots.",
    inStock: true,
    featured: false
  },
  {
    id: 3,
    name: "Smart Fitness Watch",
    price: 199.99,
    category: "Electronics",
    rating: 4.7,
    reviews: 203,
    image: "Modern smartwatch with fitness tracking",
    description: "Track your fitness goals with this advanced smartwatch featuring heart rate monitoring.",
    inStock: true,
    featured: true
  },
  {
    id: 4,
    name: "Organic Coffee Beans",
    price: 24.99,
    category: "Food",
    rating: 4.6,
    reviews: 67,
    image: "Premium organic coffee beans",
    description: "Single-origin organic coffee beans roasted to perfection for the ultimate coffee experience.",
    inStock: true,
    featured: false
  },
  {
    id: 5,
    name: "Designer Sunglasses",
    price: 159.99,
    category: "Accessories",
    rating: 4.8,
    reviews: 156,
    image: "Stylish designer sunglasses",
    description: "UV protection designer sunglasses with polarized lenses and titanium frame.",
    inStock: false,
    featured: true
  },
  {
    id: 6,
    name: "Wireless Charging Pad",
    price: 49.99,
    category: "Electronics",
    rating: 4.5,
    reviews: 92,
    image: "Sleek wireless charging pad",
    description: "Fast wireless charging pad compatible with all Qi-enabled devices.",
    inStock: true,
    featured: false
  }
];

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState(SAMPLE_PRODUCTS);
  const [filteredProducts, setFilteredProducts] = useState(SAMPLE_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const { toast } = useToast();

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('project123_user');
    const savedCart = localStorage.getItem('project123_cart');
    const savedWishlist = localStorage.getItem('project123_wishlist');
    
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    if (user) localStorage.setItem('project123_user', JSON.stringify(user));
    else localStorage.removeItem('project123_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('project123_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('project123_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Filter products
  useEffect(() => {
    let filtered = products;
    
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory]);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const handleAuth = (formData) => {
    const { email, password, name } = formData;
    
    if (authMode === 'register') {
      const newUser = { id: Date.now(), email, name };
      setUser(newUser);
      toast({
        title: "Welcome to Project123!",
        description: "Your account has been created successfully.",
      });
    } else {
      const existingUser = { id: 1, email, name: email.split('@')[0] };
      setUser(existingUser);
      toast({
        title: "Welcome back!",
        description: "You've been logged in successfully.",
      });
    }
    
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    setWishlist([]);
    toast({
      title: "Logged out",
      description: "You've been logged out successfully.",
    });
  };

  const addToCart = (product) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add items to cart.",
        variant: "destructive"
      });
      return;
    }

    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart.",
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(cart.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const toggleWishlist = (product) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add items to wishlist.",
        variant: "destructive"
      });
      return;
    }

    const isInWishlist = wishlist.some(item => item.id === product.id);
    
    if (isInWishlist) {
      setWishlist(wishlist.filter(item => item.id !== product.id));
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      setWishlist([...wishlist, product]);
      toast({
        title: "Added to wishlist!",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P3</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Project123</span>
            </motion.div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-red-500 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCartModal(true)}
                className="relative p-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </motion.button>

              {/* User Menu */}
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="hidden sm:block text-sm text-gray-600">Hi, {user.name}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="border-gray-300 hover:border-red-500 hover:text-red-600"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  className="gradient-bg hover:opacity-90 text-white"
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              )}

              {/* Mobile Menu */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-t border-gray-200"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full"
                />
              </div>
            </motion.div>
          )}
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative gradient-bg hero-pattern py-20 text-white overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Premium Shopping
            <br />
            <span className="text-yellow-300">Experience</span>
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl mb-8 text-white/90"
          >
            Discover amazing products with unbeatable quality and service
          </motion.p>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              size="lg"
              className="bg-white text-red-600 hover:bg-gray-100 font-semibold px-8 py-3 text-lg"
              onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}
            >
              Shop Now
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Category Filter */}
      <motion.section
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="py-8 bg-white border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Filter className="w-4 h-4" />
              <span>{filteredProducts.length} products</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Products Grid */}
      <motion.section
        id="products"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="py-16 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ delay: index * 0.1 }}
                  className="product-card bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="relative">
                    <img  
                      className="w-full h-64 object-cover"
                      alt={`${product.name} product image`}
                     src="https://images.unsplash.com/photo-1635865165118-917ed9e20936" />
                    {product.featured && (
                      <Badge className="absolute top-4 left-4 bg-yellow-500 text-black">
                        Featured
                      </Badge>
                    )}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-semibold">Out of Stock</span>
                      </div>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleWishlist(product)}
                      className={`absolute top-4 right-4 p-2 rounded-full ${
                        wishlist.some(item => item.id === product.id)
                          ? 'bg-red-600 text-white'
                          : 'bg-white/80 text-gray-600 hover:text-red-600'
                      } transition-colors`}
                    >
                      <Heart className="w-4 h-4" />
                    </motion.button>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {product.category}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">
                          {product.rating} ({product.reviews})
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-red-600">
                        ${product.price}
                      </span>
                      
                      <Button
                        onClick={() => addToCart(product)}
                        disabled={!product.inStock}
                        className={`${
                          product.inStock
                            ? 'gradient-bg hover:opacity-90 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P3</span>
                </div>
                <span className="text-xl font-bold">Project123</span>
              </div>
              <p className="text-gray-400">
                Your trusted destination for premium products and exceptional shopping experience.
              </p>
            </div>
            
            <div>
              <span className="text-lg font-semibold mb-4 block">Quick Links</span>
              <ul className="space-y-2 text-gray-400">
                <li><span className="hover:text-white cursor-pointer">About Us</span></li>
                <li><span className="hover:text-white cursor-pointer">Contact</span></li>
                <li><span className="hover:text-white cursor-pointer">FAQ</span></li>
                <li><span className="hover:text-white cursor-pointer">Shipping</span></li>
              </ul>
            </div>
            
            <div>
              <span className="text-lg font-semibold mb-4 block">Categories</span>
              <ul className="space-y-2 text-gray-400">
                <li><span className="hover:text-white cursor-pointer">Electronics</span></li>
                <li><span className="hover:text-white cursor-pointer">Accessories</span></li>
                <li><span className="hover:text-white cursor-pointer">Food</span></li>
                <li><span className="hover:text-white cursor-pointer">Fashion</span></li>
              </ul>
            </div>
            
            <div>
              <span className="text-lg font-semibold mb-4 block">Support</span>
              <ul className="space-y-2 text-gray-400">
                <li><span className="hover:text-white cursor-pointer">Help Center</span></li>
                <li><span className="hover:text-white cursor-pointer">Returns</span></li>
                <li><span className="hover:text-white cursor-pointer">Privacy Policy</span></li>
                <li><span className="hover:text-white cursor-pointer">Terms of Service</span></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Project123. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs value={authMode} onValueChange={setAuthMode}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <AuthForm mode="login" onSubmit={handleAuth} />
            </TabsContent>
            
            <TabsContent value="register">
              <AuthForm mode="register" onSubmit={handleAuth} />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Cart Modal */}
      <Dialog open={showCartModal} onOpenChange={setShowCartModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Shopping Cart ({cartItemCount} items)</DialogTitle>
          </DialogHeader>
          
          <div className="max-h-96 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <img  
                      className="w-16 h-16 object-cover rounded"
                      alt={`${item.name} in cart`}
                     src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
                    
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-gray-600">${item.price}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {cart.length > 0 && (
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Total: ${cartTotal.toFixed(2)}</span>
              </div>
              <Button className="w-full gradient-bg hover:opacity-90 text-white">
                Proceed to Checkout
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}

// Auth Form Component
function AuthForm({ mode, onSubmit }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === 'register' && (
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
      )}
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
      </div>
      
      <Button type="submit" className="w-full gradient-bg hover:opacity-90 text-white">
        {mode === 'login' ? 'Login' : 'Create Account'}
      </Button>
    </form>
  );
}

export default App;
