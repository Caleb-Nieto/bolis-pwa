import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// ─── Types matching the OpenAPI schema ───────────────────────────────────────

export interface BoliCategory {
    boliCategoryId: number;
    category: string
    price: number;
}

export interface Boli {
    boliId: number
    flavour: string;
    category: BoliCategory;
    stockQuantity: number;
}

export interface CreateBoliDto {
    flavour: string;
    categoryId: number;
    stockQuantity: number;
}

export interface UpdateBoliDto {
    flavour?: string;
    categoryId?: number;
    addToStock?: number;
}

export interface OrderItemDto {
    boliId: number;
    quantity: number;
}

export interface CreateOrderDto {
    shippingAddress: string;
    items: OrderItemDto[];
}

// ─── RTK Query API ───────────────────────────────────────────────────────────

export const bolisApi = createApi({
    reducerPath: 'bolisApi',
    baseQuery: fetchBaseQuery({
        // Change this to your real API URL via an env variable when deploying
        baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
    }),
    tagTypes: ['Boli', 'BoliCategory'],
    endpoints: (builder) => ({

        // GET /bolis
        getBolis: builder.query<Boli[], void>({
            query: () => '/bolis',
            providesTags: ['Boli'],
        }),

        // POST /bolis
        createBoli: builder.mutation<Boli, CreateBoliDto>({
            query: (body) => ({
                url: '/bolis',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Boli'],
        }),

        // PATCH /bolis/{id}
        updateBoli: builder.mutation<Boli, { id: number } & UpdateBoliDto>({
            query: ({ id, ...body }) => ({
                url: `/bolis/${id}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Boli'],
        }),

        // GET /bolis-category
        getBoliCategories: builder.query<BoliCategory[], void>({
            query: () => '/bolis-category',
            providesTags: ['BoliCategory'],
        }),

        // POST /orders
        createOrder: builder.mutation<unknown, CreateOrderDto>({
            query: (body) => ({
                url: '/orders',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Boli'],
        }),
    }),
});

export const {
    useGetBolisQuery,
    useCreateBoliMutation,
    useUpdateBoliMutation,
    useGetBoliCategoriesQuery,
    useCreateOrderMutation,
} = bolisApi;
