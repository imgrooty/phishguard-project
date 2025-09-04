// lib/auth.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import MicrosoftEntraIDProvider from "next-auth/providers/microsoft-entra-id";
import CredentialsProvider from "next-auth/providers/credentials";


export const { handlers, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    authorization: {
    params: {
      scope: "openid email profile https://www.googleapis.com/auth/gmail.readonly",
      access_type: "offline", // needed if you want refresh tokens
      prompt: "consent",      // forces consent screen to get new scopes
    },
  },
    
    }),
    MicrosoftEntraIDProvider({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID!,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET!,
      issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Demo login, replace with DB check
        if (
          credentials?.email === "demo@example.com" &&
          credentials?.password === "password"
        ) {
          return { id: "1", name: "Demo User", email: "demo@example.com" };
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
  
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.access_token = account.access_token;
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      session.access_token = token.access_token as string;
      session.refresh_token = token.refresh_token as string;
      session.user.provider = token.provider as string; // now available on session.user
      return session;
    },
  },
});
