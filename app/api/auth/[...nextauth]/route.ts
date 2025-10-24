import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),

    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID || "common",
      authorization: {
        params: {
          scope: "openid profile email offline_access https://graph.microsoft.com/Mail.Read",
        },
      },
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
        const user = await User.findOne({ email: credentials?.email });
        if (!user || !user.password) throw new Error("No user found");
        if (!credentials?.password) throw new Error("No password provided");
        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) throw new Error("Invalid password");
        return { id: (user._id as any).toString(), email: user.email, name: user.name };
      },
    }),
  ],

  session: { strategy: "jwt" as const },
  secret: process.env.NEXTAUTH_SECRET!,

  callbacks: {
    // ✅ Store tokens in JWT
    async jwt({ token, account, user, profile }: any) {
      // When user logs in for the first time or re-auths
      if (account) {
        token.access_token = account.access_token as string;
        token.refresh_token = account.refresh_token as string ?? token.refresh_token as string;
        token.expires_at =
          account.expires_at ??
          Math.floor(Date.now() / 1000 + (Number(account.expires_in) || 3600));
        token.provider = account.provider as string;
      }

      // Handle user data from different providers
      if (user) {
        token.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image || null,
        };
      }

      // Extract image URL from profile for all providers
      if (profile) {
        token.user = {
          ...token.user,
          image: profile.picture || profile.image || profile.avatar || profile.photo || token.user?.image,
        };
      }

      // Azure AD specific: extract user info from profile if not in user object
      if (account?.provider === "azure-ad" && profile) {
        token.user = {
          id: profile.sub || profile.oid || user?.id,
          email: profile.email || profile.preferred_username || user?.email,
          name: profile.name || user?.name,
          image: profile.picture || profile.image || token.user?.image,
        };
      }

      // If token is expired and refresh_token exists → refresh it here
      if (Date.now() / 1000 > ((token.expires_at as number) ?? 0) && token.refresh_token) {
        try {
          const response = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: process.env.GOOGLE_ID!,
              client_secret: process.env.GOOGLE_SECRET!,
              refresh_token: token.refresh_token as string,
              grant_type: "refresh_token",
            }),
          });

          const refreshedTokens = await response.json();

          if (!response.ok) throw refreshedTokens;

          token.access_token = refreshedTokens.access_token;
          token.expires_at = Math.floor(Date.now() / 1000 + refreshedTokens.expires_in);
        } catch (error) {
          console.error("❌ Token refresh failed:", error);
          // Optional: return null to sign the user out if refresh fails
        }
      }

      return token;
    },
    
    // ✅ Expose them in session for getServerSession()
    async session({ session, token }: any) {
      session.user = token.user;
      // Store provider directly in the user object
      session.user.provider = token.provider;
      // Ensure image URL is available in the user object
      session.user.image = token.user?.image;
      session.access_token = token.access_token;
      session.refresh_token = token.refresh_token;
      // Keep this for backward compatibility
      session.provider = token.provider;
      
      // Store tokens in database for background jobs
      if (token.user?.email && token.access_token) {
        try {
          await dbConnect();
          await User.findOneAndUpdate(
            { email: token.user.email.toLowerCase() },
            {
              accessToken: token.access_token,
              refreshToken: token.refresh_token,
              tokenExpiry: new Date(((token.expires_at as number) || 0) * 1000),
              provider: token.provider,
            },
            { upsert: false } // Don't create if doesn't exist
          );
        } catch (error) {
          console.error('Failed to update tokens in database:', error);
        }
      }
      
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { authOptions };
export { handler as GET, handler as POST };