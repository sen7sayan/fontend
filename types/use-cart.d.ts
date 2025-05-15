// types/use-cart.d.ts
declare module 'use-cart' {
  export interface CartItem {
    id: string;
    name?: string;
    image?: string;
    price?: number | string;
    quantity: number;
    [key: string]: any;
  }

  export interface UseCartReturn {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateItem: (id: string, updates: Partial<CartItem>) => void;
    emptyCart: () => void;
    getItem: (id: string) => CartItem | undefined;
    cartTotal: number;
    itemCount: number;
  }

  export function useCart(): UseCartReturn;

  export const CartProvider: React.FC<{ children: React.ReactNode }>;
}
