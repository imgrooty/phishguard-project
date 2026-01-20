import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import AzureADProvider from 'next-auth/providers/azure-ad';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export const authOptions = {
  providers: [
    // OAuth authentication providers...
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile https://www.googleapis.com/auth/gmail.readonly"
        }
      }
    }),
     AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID || "common",
      authorization: {
        params: {
          scope: "openid profile email offline_access Mail.Read",
        },
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
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
  session: { strategy: 'jwt' as const },
  secret: process.env.NEXTAUTH_SECRET!,
  callbacks: {
    async jwt({ token, account, user }: any) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.tokenExpiry = account.expires_at ? new Date(account.expires_at * 1000) : undefined;
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.tokenExpiry = token.tokenExpiry;
      session.provider = token.provider;
      return session;
    },
    async signIn({ user, account }: any) {
      if (account && user) {
        try {
          await dbConnect();
          await User.findOneAndUpdate(
            { email: user.email },
            {
              accessToken: account.access_token,
              refreshToken: account.refresh_token,
              tokenExpiry: account.expires_at ? new Date(account.expires_at * 1000) : undefined,
              provider: account.provider,
              name: user.name,
            },
            { upsert: true }
          );
          return true;
        } catch (error) {
          console.error("Error saving user during signIn:", error);
          return true; // Still allow sign in even if DB update fails
        }
      }
      return true;
    }
  }
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
