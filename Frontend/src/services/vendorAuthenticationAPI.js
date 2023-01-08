// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const vendorAuthenticationAPI = createApi({
  reducerPath: 'vendorAuthenticationAPI',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/vendor-api/' }),
  endpoints: (builder) => ({
    registerVendor: builder.mutation({
      query: (user) => {
        return {
              url: 'register/',
              method: 'POST',
              body: user,
              headers: {'Content-type': 'application/json',}
        }
      }
    }),


    
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useRegistervendorMutation } = vendorAuthenticationAPI