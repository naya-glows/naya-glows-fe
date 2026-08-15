import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "CUSTOMER" | "INFLUENCER";
  country: string | null;
  currency: string;
  createdAt: string;
};

type AuthState = { token: string | null; user: AuthUser | null; hydrated: boolean };

const initialState: AuthState = { token: null, user: null, hydrated: false };

const userAuthSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ token: string; user: AuthUser }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    hydrateToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
      state.hydrated = true;
    },
    clearAuth(state) {
      state.token = null;
      state.user = null;
    },
  },
});

export const { setCredentials, hydrateToken, clearAuth } = userAuthSlice.actions;
export default userAuthSlice.reducer;

export const USER_TOKEN_KEY = "naya-glows-user-token";

// The checkout page's "remember my shipping details" convenience prefill —
// keyed here (not in checkout/page.tsx) so useUserAuth's logout can clear
// it too. It holds PII (name, email, phone, address) tied to whoever last
// checked out in this browser, so it must not survive a sign-out.
export const SHIPPING_STORAGE_KEY = "naya-glows-shipping-details";
