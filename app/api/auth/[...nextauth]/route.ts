import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import AzureADProvider from "next-auth/providers/azure-ad";

export const handler = NextAuth({
  providers: [
    // OAuth authentication providers...
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!
    }),
     AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID || "common",
    }),
  ]
})

export { handler as GET, handler as POST };
