import React, { createContext, useContext, useState, useEffect } from 'react';
import { GetProductCart, GetProductWishlist } from '../../../Common/ServerAPI';

interface CartWishlistContextType {
    cartCount: number;
    wishlistCount: number;
    updateCartCount: () => Promise<void>;
    updateWishlistCount: () => Promise<void>;
    incrementCart: () => void;
    decrementCart: () => void;
    incrementWishlist: () => void;
    decrementWishlist: () => void;
    setCartCount: (count: number) => void;
    setWishlistCount: (count: number) => void;
}

const CartWishlistContext = createContext<CartWishlistContextType | undefined>(undefined);

export const CartWishlistProvider: React.FC<{ children: any }> = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);

    // Fetch cart count
    const updateCartCount = async () => {
        try {
            const response = await GetProductCart();
            const items = response?.data?.data?.cart_items || [];
            setCartCount(items.length);
        } catch (error) {
            console.error('Failed to fetch cart count:', error);
        }
    };

    // Fetch wishlist count
    const updateWishlistCount = async () => {
        try {
            const response = await GetProductWishlist();
            const items = response?.data?.data?.wishlist || [];
            setWishlistCount(items.length);
        } catch (error) {
            console.error('Failed to fetch wishlist count:', error);
        }
    };

    // Manual increment/decrement
    const incrementCart = () => setCartCount(prev => prev + 1);
    const decrementCart = () => setCartCount(prev => Math.max(0, prev - 1));
    const incrementWishlist = () => setWishlistCount(prev => prev + 1);
    const decrementWishlist = () => setWishlistCount(prev => Math.max(0, prev - 1));

    useEffect(() => {
        updateCartCount();
        updateWishlistCount();
    }, []);

    return (
        <CartWishlistContext.Provider
            value={{
                cartCount,
                wishlistCount,
                updateCartCount,
                updateWishlistCount,
                incrementCart,
                decrementCart,
                incrementWishlist,
                decrementWishlist,
                setCartCount,
                setWishlistCount,
            }}
        >
            {children}
        </CartWishlistContext.Provider>
    );
};

export const useCartWishlist = () => {
    const context = useContext(CartWishlistContext);
    if (!context) {
        throw new Error('useCartWishlist must be used within CartWishlistProvider');
    }
    return context;
};