import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";
import type { RootState } from "./store";
import { clearAuth as clearUserAuth, USER_TOKEN_KEY, type AuthUser } from "./userAuthSlice";
import type { Product } from "@/lib/products";

export type ReferralCodeRow = {
  id: string;
  code: string;
  createdAt: string;
  signupCount: number;
};

export type InfluencerProfile = {
  id: string;
  name: string;
  email: string;
  platform: string | null;
  socialHandle: string | null;
  bio: string | null;
  createdAt: string;
};

export type MyOrderRow = {
  id: string;
  status: string;
  currency: string;
  total: number;
  createdAt: string;
  items: { qty: number; isSubscription: boolean; product: { name: string; image: string } }[];
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).userAuth.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

// Login/register 401s (wrong/expired OTP code, duplicate email, etc.) are
// just a failed attempt, not an expired session — exempt them so the
// interceptor below doesn't fire a bogus "session expired" toast and
// redirect while someone's simply mistyping their code on /signin.
const AUTH_ENDPOINTS = ["/auth/login-otp", "/auth/register"];
function isAuthEndpoint(args: string | FetchArgs): boolean {
  const url = typeof args === "string" ? args : args.url;
  return AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));
}

// 401 interceptor: clears the customer session, toasts, and sends the user
// back to /signin — kept separate from adminApi's version so an admin
// session in the same browser is never touched by a customer 401.
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status === 401 && !isAuthEndpoint(args)) {
    api.dispatch(clearUserAuth());
    if (typeof window !== "undefined") {
      localStorage.removeItem(USER_TOKEN_KEY);
      toast.error("Session expired — please sign in again.");
      window.location.href = "/signin";
    }
  }
  return result;
};

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["SavedProducts", "MyOrders", "ReferralCodes", "Me"],
  endpoints: (builder) => ({
    requestSignupOtp: builder.mutation<{ sent: boolean }, { email: string }>({
      query: (body) => ({ url: "/auth/otp/request", method: "POST", body }),
    }),
    register: builder.mutation<
      { user: AuthUser; token: string },
      {
        email: string;
        name: string;
        country?: string;
        referralCode?: string;
        otpCode: string;
      }
    >({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
    }),
    // Customer signin is OTP-only — request a code, then verify it below.
    requestLoginOtp: builder.mutation<{ sent: boolean }, { email: string }>({
      query: (body) => ({ url: "/auth/otp/login-request", method: "POST", body }),
    }),
    loginWithOtp: builder.mutation<
      { user: AuthUser; token: string },
      { email: string; otpCode: string }
    >({
      query: (body) => ({ url: "/auth/login-otp", method: "POST", body }),
    }),
    getMe: builder.query<{ user: AuthUser }, void>({
      query: () => "/auth/me",
      providesTags: ["Me"],
    }),
    updateProfile: builder.mutation<
      { user: AuthUser },
      { name?: string; email?: string; country?: string }
    >({
      query: (body) => ({ url: "/auth/me", method: "PATCH", body }),
      invalidatesTags: ["Me"],
    }),
    // Mirrors the signed-in customer's cart server-side purely so the
    // backend can notice an abandoned one and send a reminder — see
    // StoreHydrator.tsx, which calls this whenever the cart changes.
    syncCart: builder.mutation<{ ok: boolean }, { items: { slug: string; name: string; qty: number }[] }>({
      query: (body) => ({ url: "/cart", method: "PUT", body }),
    }),
    createOrder: builder.mutation<
      { order: { id: string } },
      {
        items: {
          slug: string;
          qty: number;
          isSubscription?: boolean;
          variantName?: string;
        }[];
        shippingDetails: Record<string, string>;
      }
    >({
      query: (body) => ({ url: "/orders", method: "POST", body }),
      invalidatesTags: [{ type: "MyOrders", id: "LIST" }],
    }),
    listMyOrders: builder.query<MyOrderRow[], void>({
      query: () => "/orders/mine",
      transformResponse: (res: { orders: MyOrderRow[] }) => res.orders,
      providesTags: [{ type: "MyOrders", id: "LIST" }],
    }),
    // Upgrades the currently signed-in customer to an influencer — there is
    // no separate influencer account/registration, this appends an
    // Influencer profile to whichever account the caller is authed as.
    upgradeInfluencer: builder.mutation<
      { user: AuthUser; token: string },
      { platform?: string; socialHandle?: string; bio?: string }
    >({
      query: (body) => ({ url: "/influencers/upgrade", method: "POST", body }),
      invalidatesTags: ["Me"],
    }),
    getMyInfluencerProfile: builder.query<InfluencerProfile, void>({
      query: () => "/influencers/me",
      transformResponse: (res: { influencer: InfluencerProfile }) => res.influencer,
    }),
    listMyReferralCodes: builder.query<ReferralCodeRow[], void>({
      query: () => "/influencers/codes",
      transformResponse: (res: { codes: ReferralCodeRow[] }) => res.codes,
      providesTags: [{ type: "ReferralCodes", id: "LIST" }],
    }),
    generateReferralCode: builder.mutation<ReferralCodeRow, void>({
      query: () => ({ url: "/influencers/codes", method: "POST" }),
      transformResponse: (res: { code: ReferralCodeRow }) => res.code,
      invalidatesTags: [{ type: "ReferralCodes", id: "LIST" }],
    }),
    trackOrder: builder.query<
      {
        order: {
          id: string;
          status: string;
          total: number;
          currency: string;
          items: { qty: number; product: { name: string } }[];
        };
        tracking: {
          currentStage: string | null;
          stages: { key: string; label: string; date: string; reached: boolean }[];
          estimatedDelivery: string | null;
        };
      },
      { id: string; email: string }
    >({
      query: ({ id, email }) => `/orders/track/${id}?email=${encodeURIComponent(email)}`,
    }),
    initializePayment: builder.mutation<
      { reference: string; email: string; amount: number; currency: string },
      { orderId: string }
    >({
      query: (body) => ({ url: "/payments/paystack/initialize", method: "POST", body }),
    }),
    verifyPayment: builder.query<
      {
        order: {
          id: string;
          status: string;
          shippingDetails: { email?: string } | null;
        };
        payment: { status: string };
      },
      string
    >({
      query: (reference) => `/payments/paystack/verify/${reference}`,
    }),
    // "Subscription A" — the signed-in customer's own standing reorder
    // discounts (see productSubscriptions.service.ts). Used at checkout so
    // the price preview matches what the server will actually charge.
    listMyProductSubscriptions: builder.query<
      {
        id: string;
        discountPercent: number;
        code: string;
        product: { slug: string; name: string; image: string };
      }[],
      void
    >({
      query: () => "/subscriptions/mine",
      transformResponse: (res: {
        subscriptions: {
          id: string;
          discountPercent: number;
          code: string;
          product: { slug: string; name: string; image: string };
        }[];
      }) => res.subscriptions,
    }),
    // "Subscription B" — public, no auth needed: a live cost/discount
    // preview while the customer is still choosing products and a term.
    quoteSubscriptionPlan: builder.mutation<
      {
        quote: {
          months: number;
          discountPercent: number;
          baseTotal: number;
          discountedTotal: number;
          items: { productId: string; slug: string; name: string; unitPrice: number; qtyPerMonth: number; totalQtyForTerm: number }[];
        };
      },
      { term: "THREE_MONTH" | "SIX_MONTH" | "TWELVE_MONTH"; items: { slug: string; qtyPerMonth: number }[] }
    >({
      query: (body) => ({ url: "/subscriptions/plans/quote", method: "POST", body }),
    }),
    createSubscriptionPlan: builder.mutation<
      { order: { id: string }; plan: { id: string } },
      {
        term: "THREE_MONTH" | "SIX_MONTH" | "TWELVE_MONTH";
        items: { slug: string; qtyPerMonth: number }[];
        shippingDetails: Record<string, string>;
      }
    >({
      query: (body) => ({ url: "/subscriptions/plans", method: "POST", body }),
    }),
    // Public single-key content lookup. The backend returns 404 when no
    // override exists for this key — that's expected, not an error, so
    // callers (useSectionContent) treat a failed/empty result as "use the
    // hardcoded default" rather than surfacing it.
    getContent: builder.query<{ block: { key: string; data: unknown } }, string>({
      query: (key) => `/content/${key}`,
    }),
    submitConsultation: builder.mutation<
      { request: { id: string } },
      {
        name: string;
        email: string;
        phone?: string;
        skinConcern: string;
        preferredDate?: string;
        message?: string;
      }
    >({
      query: (body) => ({ url: "/consultations", method: "POST", body }),
    }),
    submitWholesaleInquiry: builder.mutation<
      { inquiry: { id: string } },
      { businessName: string; contactName: string; email: string; phone?: string; message?: string }
    >({
      query: (body) => ({ url: "/wholesale-inquiries", method: "POST", body }),
    }),
    submitContactMessage: builder.mutation<
      { contactMessage: { id: string } },
      { name: string; email: string; subject?: string; message: string }
    >({
      query: (body) => ({ url: "/contact-messages", method: "POST", body }),
    }),
    subscribeNewsletter: builder.mutation<{ subscribed: boolean }, { email: string }>({
      query: (body) => ({ url: "/newsletter/subscribe", method: "POST", body }),
    }),
    getPublicSettings: builder.query<
      {
        settings: {
          usdToNgnRate: number;
          subscriptionDiscountPercent: number;
          subscriptionB3MonthPercent: number;
          subscriptionB6MonthPercent: number;
          subscriptionB12MonthPercent: number;
          subscriptionBFulfillmentMode: "immediate" | "recurring";
        };
      },
      void
    >({
      query: () => "/settings/public",
    }),
    // `product` (the full row to show immediately if this is a *save*, not
    // an unsave) never leaves the client — only `slug` is sent to the
    // server. Optimistic: the heart/saved-list updates the instant it's
    // clicked, via a direct cache patch; if the request fails, the patch is
    // rolled back so the like effect disappears again instead of lying
    // about the actual saved state.
    toggleSavedProduct: builder.mutation<{ saved: boolean }, { slug: string; product?: Product }>({
      query: ({ slug }) => ({ url: "/saved-products/toggle", method: "POST", body: { slug } }),
      async onQueryStarted({ slug, product }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          userApi.util.updateQueryData("listSavedProducts", undefined, (draft) => {
            const idx = draft.findIndex((p) => p.slug === slug);
            if (idx >= 0) {
              draft.splice(idx, 1);
            } else if (product) {
              draft.push(product);
            }
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: [{ type: "SavedProducts", id: "LIST" }],
    }),
    listSavedProducts: builder.query<Product[], void>({
      query: () => "/saved-products/my",
      transformResponse: (res: { products: Product[] }) => res.products,
      providesTags: [{ type: "SavedProducts", id: "LIST" }],
    }),
  }),
});

export const {
  useRequestSignupOtpMutation,
  useRegisterMutation,
  useRequestLoginOtpMutation,
  useLoginWithOtpMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
  useSyncCartMutation,
  useCreateOrderMutation,
  useListMyOrdersQuery,
  useUpgradeInfluencerMutation,
  useGetMyInfluencerProfileQuery,
  useListMyReferralCodesQuery,
  useGenerateReferralCodeMutation,
  useInitializePaymentMutation,
  useVerifyPaymentQuery,
  useGetContentQuery,
  useTrackOrderQuery,
  useSubmitConsultationMutation,
  useSubmitWholesaleInquiryMutation,
  useSubmitContactMessageMutation,
  useSubscribeNewsletterMutation,
  useGetPublicSettingsQuery,
  useToggleSavedProductMutation,
  useListSavedProductsQuery,
  useListMyProductSubscriptionsQuery,
  useQuoteSubscriptionPlanMutation,
  useCreateSubscriptionPlanMutation,
} = userApi;
