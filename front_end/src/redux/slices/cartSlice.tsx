import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
export interface name {
  en: string;
  ar: string;
  fr: string;
}
export interface CartItem {
  name: name;
  productId: string;
  detailId: string;
  colorName: name;
  price: number;
  quantity: number;
  size: string;
  colorCode: string;
  picture?: string;
}

const CartSlice = createSlice({
  name: "cart",
  initialState: {
    items: JSON.parse(localStorage?.getItem("cart") || "[]"),
    openSheet: false,
  },
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const item = state.items.find(
        (i: CartItem) => i.detailId === action.payload.detailId
      );
      if (item) {
        item.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      localStorage.setItem("cart", JSON.stringify(state.items));
      state.openSheet = true;
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      
      state.items=state.items.filter(
        (items: CartItem) => items.productId !== action.payload
      );
      console.log(state.items);
     
      localStorage.setItem("cart", JSON.stringify(state.items));
      console.log(state.items);
    },
    updateQuantitySlice: (state, action: PayloadAction<[string,number]>) => {
      const [detailId,newQt] = action.payload
      const item = state.items.find(
        (i: CartItem) => i?.detailId == detailId
      );

      if (item) {
        item.quantity = newQt
      }
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    setCartItems:(state,action)=>{
      state.items=action.payload
    },
    clearCart: (state) => {
      localStorage.removeItem("cart");
      state.items = [];
    },
    closeSheet: (state) => {
      state.openSheet = false;

    },
    openSheet: (state) => {
      state.openSheet = true;
    },
  },
});
export const {
  addToCart,
  removeFromCart,
  updateQuantitySlice,
  clearCart,
  closeSheet,
  openSheet,
  setCartItems
} = CartSlice.actions;
export default CartSlice.reducer;
