"use client"

import ChatInterface from "@/components/client components/chat/ChatInterface"
import Layout from "@/components/layout/Layout"

import type { User } from "@/lib/types"

// Mock user data - in a real app, this would come from authentication
const mockUser: User = {
  id: "client123",
  name: "John Doe",
  email: "john.doe@example.com",
  role: "client",
  avatar: "https://ui-avatars.com/api/?name=John+Doe&background=random",
}

export default function SupportChatPage() {
  return (
    <Layout user={mockUser} title="Support Chat" description="Get help from our support team">
      <ChatInterface clientName={mockUser.name} clientAvatar={mockUser.avatar} />
    </Layout>
  )
}

