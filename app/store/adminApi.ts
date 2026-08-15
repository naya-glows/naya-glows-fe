import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";
import type { RootState } from "./store";
import { clearAuth as clearAdminAuth, ADMIN_TOKEN_KEY, type AuthUser } from "./adminAuthSlice";
import type { Product } from "@/lib/products";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).adminAuth.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

// A failed login attempt (wrong password) is not an expired session —
// exempt it so the interceptor below doesn't fire a bogus "session expired"
// toast and redirect while an admin is simply mistyping their password.
function isAuthEndpoint(args: string | FetchArgs): boolean {
  const url = typeof args === "string" ? args : args.url;
  return url.includes("/auth/login");
}

// 401 interceptor: clears the admin session, toasts, and sends the admin
// back to /admin/login — independent of userApi's interceptor so a
// customer session in the same browser is never touched by an admin 401.
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status === 401 && !isAuthEndpoint(args)) {
    api.dispatch(clearAdminAuth());
    if (typeof window !== "undefined") {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      toast.error("Session expired — please sign in again.");
      window.location.href = "/admin/login";
    }
  }
  return result;
};

export type AdminUserRow = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  country: string | null;
  currency: string;
  createdAt: string;
};

export type AdminOrderRow = {
  id: string;
  status: string;
  currency: string;
  total: number;
  createdAt: string;
  manualStage: string | null;
  user: { firstName: string; lastName: string; email: string } | null;
  shippingDetails: Record<string, string> | null;
  items: { qty: number; isSubscription: boolean; product: { name: string } }[];
};

// Mirrors backend/src/modules/orders/tracking.ts's STAGE_DEFS — UI-only
// labels for the manual tracking-stage selector, kept as a small constant
// here rather than round-tripping to the server just for display strings.
export const TRACKING_STAGES = [
  { key: "PLACED", label: "Order Placed" },
  { key: "PROCESSING", label: "Processing" },
  { key: "DISPATCHED", label: "Dispatched" },
  { key: "DELIVERED", label: "Delivered" },
] as const;

export type ContactMessageRow = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  createdAt: string;
};

export type NewsletterSubscriberRow = {
  id: string;
  email: string;
  createdAt: string;
};

export type EmailCampaignRow = {
  id: string;
  subject: string;
  html: string;
  recipientCount: number;
  audience: "subscribers" | "allUsers";
  createdAt: string;
};

export type SettingsPayload = {
  usdToNgnRate: number;
  subscriptionDiscountPercent: number;
  subscriptionB3MonthPercent: number;
  subscriptionB6MonthPercent: number;
  subscriptionB12MonthPercent: number;
  subscriptionBFulfillmentMode: "immediate" | "recurring";
  shippingFeeLagosNgn: number;
  shippingFeeOutsideLagosNgn: number;
};

export type BudgetSummary = {
  currency: string;
  paidOrderCount: number;
  orderRevenue: number;
  manualIncome: number;
  manualExpense: number;
  net: number;
};

export type BudgetEntryRow = {
  id: string;
  label: string;
  amount: number;
  type: "income" | "expense";
  note: string | null;
  createdAt: string;
};

export type AdminInfluencerRow = {
  id: string;
  name: string;
  email: string;
  codeName: string;
  twitterHandle: string | null;
  instagramHandle: string | null;
  tiktokHandle: string | null;
  bio: string | null;
  createdAt: string;
  codes: { code: string; signupCount: number }[];
  totalSignups: number;
};

export type ContentBlockRow = { id: string; key: string; data: unknown; updatedAt: string };

export type AdminProductSubscriptionRow = {
  id: string;
  code: string;
  discountPercent: number;
  createdAt: string;
  user: { firstName: string; lastName: string; email: string };
  product: { name: string; slug: string };
};

export type AdminSubscriptionPlanRow = {
  id: string;
  term: "THREE_MONTH" | "SIX_MONTH" | "TWELVE_MONTH";
  fulfillmentMode: "immediate" | "recurring";
  items: { slug: string; name: string; qtyPerMonth: number }[];
  discountPercent: number;
  totalPaid: number;
  status: "ACTIVE" | "CANCELLED" | "COMPLETED";
  remainingShipments: number;
  nextShipmentDate: string | null;
  createdAt: string;
  user: { firstName: string; lastName: string; email: string };
};

export type ConsultationRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  skinConcern: string;
  preferredDate: string | null;
  message: string | null;
  status: string;
  createdAt: string;
};

export type WholesaleInquiryRow = {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string | null;
  message: string | null;
  status: string;
  createdAt: string;
};

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Product",
    "Content",
    "User",
    "Order",
    "Settings",
    "ContactMessage",
    "NewsletterSubscriber",
    "EmailCampaign",
    "BudgetEntry",
    "Influencer",
  ],
  endpoints: (builder) => ({
    login: builder.mutation<
      { user: AuthUser; token: string },
      { email: string; password: string }
    >({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    getMe: builder.query<{ user: AuthUser }, void>({
      query: () => "/auth/me",
    }),

    listProducts: builder.query<Product[], void>({
      query: () => "/products",
      transformResponse: (res: { products: Product[] }) => res.products,
      providesTags: (result) =>
        result
          ? [
              ...result.map((p) => ({ type: "Product" as const, id: p.slug })),
              { type: "Product" as const, id: "LIST" },
            ]
          : [{ type: "Product" as const, id: "LIST" }],
    }),
    createProduct: builder.mutation<Product, Partial<Product>>({
      query: (body) => ({ url: "/products", method: "POST", body }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
    updateProduct: builder.mutation<Product, Partial<Product> & { slug: string }>({
      query: ({ slug, ...body }) => ({ url: `/products/${slug}`, method: "PUT", body }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (slug) => ({ url: `/products/${slug}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
    uploadImage: builder.mutation<{ url: string }, FormData>({
      query: (formData) => ({ url: "/uploads", method: "POST", body: formData }),
    }),

    listContent: builder.query<ContentBlockRow[], void>({
      query: () => "/content",
      transformResponse: (res: { blocks: ContentBlockRow[] }) => res.blocks,
      providesTags: [{ type: "Content", id: "LIST" }],
    }),
    upsertContent: builder.mutation<ContentBlockRow, { key: string; data: unknown }>({
      query: ({ key, data }) => ({ url: `/content/${key}`, method: "PUT", body: { data } }),
      invalidatesTags: [{ type: "Content", id: "LIST" }],
    }),
    deleteContent: builder.mutation<void, string>({
      query: (key) => ({ url: `/content/${key}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Content", id: "LIST" }],
    }),

    listUsers: builder.query<AdminUserRow[], void>({
      query: () => "/admin/users",
      transformResponse: (res: { users: AdminUserRow[] }) => res.users,
      providesTags: [{ type: "User", id: "LIST" }],
    }),

    listOrders: builder.query<AdminOrderRow[], void>({
      query: () => "/admin/orders",
      transformResponse: (res: { orders: AdminOrderRow[] }) => res.orders,
      providesTags: [{ type: "Order", id: "LIST" }],
    }),
    setOrderTrackingStage: builder.mutation<void, { id: string; stage: string | null }>({
      query: ({ id, stage }) => ({ url: `/admin/orders/${id}/tracking`, method: "PUT", body: { stage } }),
      invalidatesTags: [{ type: "Order", id: "LIST" }],
    }),

    listConsultations: builder.query<ConsultationRow[], void>({
      query: () => "/admin/consultations",
      transformResponse: (res: { requests: ConsultationRow[] }) => res.requests,
    }),

    listWholesaleInquiries: builder.query<WholesaleInquiryRow[], void>({
      query: () => "/admin/wholesale-inquiries",
      transformResponse: (res: { inquiries: WholesaleInquiryRow[] }) => res.inquiries,
    }),

    getSettings: builder.query<SettingsPayload, void>({
      query: () => "/admin/settings",
      transformResponse: (res: { settings: SettingsPayload }) => res.settings,
      providesTags: [{ type: "Settings", id: "LIST" }],
    }),
    updateSetting: builder.mutation<SettingsPayload, { key: string; value: string | number }>({
      query: ({ key, value }) => ({ url: `/admin/settings/${key}`, method: "PUT", body: { value } }),
      transformResponse: (res: { settings: SettingsPayload }) => res.settings,
      invalidatesTags: [{ type: "Settings", id: "LIST" }],
    }),

    listContactMessages: builder.query<ContactMessageRow[], void>({
      query: () => "/admin/contact-messages",
      transformResponse: (res: { messages: ContactMessageRow[] }) => res.messages,
      providesTags: [{ type: "ContactMessage", id: "LIST" }],
    }),

    listNewsletterSubscribers: builder.query<NewsletterSubscriberRow[], void>({
      query: () => "/admin/newsletter-subscribers",
      transformResponse: (res: { subscribers: NewsletterSubscriberRow[] }) => res.subscribers,
      providesTags: [{ type: "NewsletterSubscriber", id: "LIST" }],
    }),

    listEmailCampaigns: builder.query<EmailCampaignRow[], void>({
      query: () => "/admin/email-campaigns",
      transformResponse: (res: { campaigns: EmailCampaignRow[] }) => res.campaigns,
      providesTags: [{ type: "EmailCampaign", id: "LIST" }],
    }),
    sendEmailCampaign: builder.mutation<
      { campaign: EmailCampaignRow; sentCount: number; failedCount: number },
      { subject: string; message: string; imageUrls?: string[]; audience: "subscribers" | "allUsers" }
    >({
      query: (body) => ({ url: "/admin/email-campaigns/send", method: "POST", body }),
      invalidatesTags: [{ type: "EmailCampaign", id: "LIST" }],
    }),

    getBudgetSummary: builder.query<BudgetSummary, void>({
      query: () => "/admin/budget/summary",
      transformResponse: (res: { summary: BudgetSummary }) => res.summary,
      providesTags: [{ type: "BudgetEntry", id: "SUMMARY" }],
    }),
    listBudgetEntries: builder.query<BudgetEntryRow[], void>({
      query: () => "/admin/budget/entries",
      transformResponse: (res: { entries: BudgetEntryRow[] }) => res.entries,
      providesTags: [{ type: "BudgetEntry", id: "LIST" }],
    }),
    createBudgetEntry: builder.mutation<
      BudgetEntryRow,
      { label: string; amount: number; type: "income" | "expense"; note?: string }
    >({
      query: (body) => ({ url: "/admin/budget/entries", method: "POST", body }),
      transformResponse: (res: { entry: BudgetEntryRow }) => res.entry,
      invalidatesTags: [
        { type: "BudgetEntry", id: "LIST" },
        { type: "BudgetEntry", id: "SUMMARY" },
      ],
    }),
    deleteBudgetEntry: builder.mutation<void, string>({
      query: (id) => ({ url: `/admin/budget/entries/${id}`, method: "DELETE" }),
      invalidatesTags: [
        { type: "BudgetEntry", id: "LIST" },
        { type: "BudgetEntry", id: "SUMMARY" },
      ],
    }),

    listInfluencers: builder.query<AdminInfluencerRow[], void>({
      query: () => "/admin/influencers",
      transformResponse: (res: { influencers: AdminInfluencerRow[] }) => res.influencers,
      providesTags: [{ type: "Influencer", id: "LIST" }],
    }),

    listAdminSubscriptions: builder.query<
      { productSubscriptions: AdminProductSubscriptionRow[]; plans: AdminSubscriptionPlanRow[] },
      void
    >({
      query: () => "/admin/subscriptions",
    }),
  }),
});

export const {
  useLoginMutation,
  useGetMeQuery,
  useListProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadImageMutation,
  useListContentQuery,
  useUpsertContentMutation,
  useDeleteContentMutation,
  useListUsersQuery,
  useListOrdersQuery,
  useSetOrderTrackingStageMutation,
  useListConsultationsQuery,
  useListWholesaleInquiriesQuery,
  useGetSettingsQuery,
  useUpdateSettingMutation,
  useListContactMessagesQuery,
  useListNewsletterSubscribersQuery,
  useListEmailCampaignsQuery,
  useSendEmailCampaignMutation,
  useGetBudgetSummaryQuery,
  useListBudgetEntriesQuery,
  useCreateBudgetEntryMutation,
  useDeleteBudgetEntryMutation,
  useListInfluencersQuery,
  useListAdminSubscriptionsQuery,
} = adminApi;
