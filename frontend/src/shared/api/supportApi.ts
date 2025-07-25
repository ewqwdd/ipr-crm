import {
  CreateSupportTicketDto,
  SupportTicketStatus,
  SupportTicketType,
} from '@/entities/support';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const supportApi = createApi({
  reducerPath: 'supportApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL + '/support',
    credentials: 'include',
  }),
  tagTypes: ['Support', 'SupportAdmin'],
  endpoints: (build) => ({
    getTickets: build.query<SupportTicketType[], void>({
      query: () => '',
      providesTags: ['Support'],
    }),
    getAdminTickets: build.query<
      { data: SupportTicketType[]; total: number },
      { page: number; limit: number; status: SupportTicketStatus }
    >({
      query: (params) => ({
        url: '/admin',
        params,
      }),
      providesTags: (_, __, params) => [{ type: 'SupportAdmin', ...params }],
    }),
    getTicket: build.query<SupportTicketType, number>({
      query: (id) => `/${id}`,
      providesTags: (_, __, id) => [{ type: 'Support', id }],
    }),
    createTicket: build.mutation<void, CreateSupportTicketDto>({
      query: (body) => ({
        url: '',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Support', 'SupportAdmin'],
    }),
    updateTicketStatus: build.mutation<
      void,
      { id: number; status: SupportTicketStatus }
    >({
      query: ({ id, status }) => ({
        url: `/admin/${id}/status`,
        method: 'POST',
        body: { status },
      }),
      invalidatesTags: ['Support', 'SupportAdmin'],
    }),
    assignSelfToTicket: build.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `/admin/${id}/assign-self`,
        method: 'POST',
      }),
      invalidatesTags: ['Support', 'SupportAdmin'],
    }),
  }),
});

export { supportApi };
