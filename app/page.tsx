"use client"

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-6 text-primary">Project Management Dashboard</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Choose your dashboard to get started
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/admin">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Admin Dashboard
            </Button>
          </Link>
          <Link href="/developer">
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
            >
              Developer Dashboard
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}