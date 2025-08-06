import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import { compare } from "bcryptjs"
import { authenticator } from "otplib"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/new-user",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        twoFactorCode: { label: "2FA Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await compare(credentials.password, user.password || "")

        if (!isPasswordValid) {
          return null
        }

        // Check 2FA if enabled
        if (user.twoFactorEnabled && user.twoFactorSecret) {
          if (!credentials.twoFactorCode) {
            throw new Error("2FA_REQUIRED")
          }

          const isValid = authenticator.verify({
            token: credentials.twoFactorCode,
            secret: user.twoFactorSecret,
          })

          if (!isValid) {
            throw new Error("INVALID_2FA_CODE")
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
          image: user.image,
          verified: user.verified,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.username = user.username
        token.verified = user.verified
      }

      if (account) {
        token.accessToken = account.access_token
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.username = token.username as string
        session.user.verified = token.verified as boolean
      }

      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          })

          if (!existingUser) {
            // Generate unique username from email or name
            let username = user.email?.split("@")[0] || user.name?.toLowerCase().replace(/\s+/g, "_")
            
            // Ensure username is unique
            let counter = 1
            let finalUsername = username
            while (await prisma.user.findUnique({ where: { username: finalUsername } })) {
              finalUsername = `${username}${counter}`
              counter++
            }

            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name,
                username: finalUsername!,
                image: user.image,
                emailVerified: new Date(),
              },
            })
          }

          return true
        } catch (error) {
          console.error("Error during sign in:", error)
          return false
        }
      }

      return true
    },
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      if (isNewUser) {
        // Send welcome notification
        await prisma.notification.create({
          data: {
            userId: user.id,
            type: "SYSTEM",
            title: "Welcome to SocialApp!",
            message: "Welcome to the future of social media. Start by completing your profile and following some interesting people.",
          },
        })
      }
    },
  },
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      username: string
      image?: string
      verified: boolean
    }
  }

  interface User {
    username: string
    verified: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    username: string
    verified: boolean
  }
}