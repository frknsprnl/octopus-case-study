"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode
} from "react";
import { useAuth } from "./AuthContext";

export interface CartProduct {
  cartKey: string;
  id: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
  total: number;
  color?: string;
  feature?: string;
}

interface CartState {
  id: number | null;
  products: CartProduct[];
  total: number;
  totalQuantities: number;
}

export interface AddableProduct {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  color?: string;
  feature?: string;
}

interface CartContextValue {
  cart: CartState;
  addToCart: (product: AddableProduct, quantity?: number) => Promise<void>;
  removeFromCart: (cartKey: string) => void;
  updateQuantity: (cartKey: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  isFetching: boolean;
}

const EMPTY_CART: CartState = { id: null, products: [], total: 0, totalQuantities: 0 };

const CartContext = createContext<CartContextValue | null>(null);

function makeCartKey(id: number, color?: string, feature?: string) {
  return [id, color, feature].filter(Boolean).join("|");
}

function recalc(products: CartProduct[]): Pick<CartState, "total" | "totalQuantities"> {
  return {
    total: products.reduce((sum, p) => sum + p.price * p.quantity, 0),
    totalQuantities: products.reduce((sum, p) => sum + p.quantity, 0)
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartState>(EMPTY_CART);
  const [isOpen, setIsOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  // Stable ref so addToCart always sees the latest cart.id without re-creating the callback
  const cartIdRef = useRef<number | null>(null);

  useEffect(() => {
    cartIdRef.current = cart.id;
  }, [cart.id]);

  // Fetch existing cart on login
  useEffect(() => {
    if (!user) {
      setCart(EMPTY_CART);
      return;
    }

    async function fetchUserCart() {
      setIsFetching(true);
      try {
        const res = await fetch(`https://dummyjson.com/carts/user/${user!.id}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.carts?.length > 0) {
          const c = data.carts[0];
          setCart({
            id: c.id,
            products: (c.products ?? []).map((p: Omit<CartProduct, "cartKey">) => ({
              ...p,
              cartKey: makeCartKey(p.id)
            })),
            total: c.total ?? 0,
            totalQuantities: c.totalQuantities ?? 0
          });
        }
      } catch {
        // Non-fatal — cart starts empty
      } finally {
        setIsFetching(false);
      }
    }

    fetchUserCart();
  }, [user]);

  const addToCart = useCallback(
    async (product: AddableProduct, quantity = 1) => {
      if (!user) return;

      const key = makeCartKey(product.id, product.color, product.feature);

      // Optimistic update
      setCart((prev) => {
        const existing = prev.products.find((p) => p.cartKey === key);
        const newProducts: CartProduct[] = existing
          ? prev.products.map((p) =>
              p.cartKey === key
                ? { ...p, quantity: p.quantity + quantity, total: (p.quantity + quantity) * p.price }
                : p
            )
          : [
              ...prev.products,
              {
                cartKey: key,
                id: product.id,
                title: product.title,
                price: product.price,
                thumbnail: product.thumbnail,
                quantity,
                total: product.price * quantity,
                color: product.color,
                feature: product.feature
              }
            ];
        return { ...prev, ...recalc(newProducts), products: newProducts };
      });

      setIsOpen(true);

      // Sync with DummyJSON
      try {
        const currentCartId = cartIdRef.current;
        if (currentCartId) {
          await fetch(`https://dummyjson.com/carts/${currentCartId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ merge: true, products: [{ id: product.id, quantity }] })
          });
        } else {
          const res = await fetch("https://dummyjson.com/carts/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id, products: [{ id: product.id, quantity }] })
          });
          if (res.ok) {
            const data = await res.json();
            setCart((prev) => ({ ...prev, id: data.id }));
          }
        }
      } catch {
        // API failure is non-fatal; local state is already updated
      }
    },
    [user]
  );

  function clearCart() {
    setCart(EMPTY_CART);
  }

  function removeFromCart(cartKey: string) {
    setCart((prev) => {
      const newProducts = prev.products.filter((p) => p.cartKey !== cartKey);
      return { ...prev, ...recalc(newProducts), products: newProducts };
    });
  }

  function updateQuantity(cartKey: string, quantity: number) {
    if (quantity <= 0) {
      removeFromCart(cartKey);
      return;
    }
    setCart((prev) => {
      const newProducts = prev.products.map((p) =>
        p.cartKey === cartKey ? { ...p, quantity, total: quantity * p.price } : p
      );
      return { ...prev, ...recalc(newProducts), products: newProducts };
    });
  }

  const cartCount = cart.products.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        isFetching
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
