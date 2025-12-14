'use client'

import { useState } from 'react'
import { submitContactForm } from '@/lib/payload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      message: formData.get('message') as string,
    }

    try {
      await submitContactForm(data)
      setStatus('success')
      e.currentTarget.reset()
    } catch (error) {
      setStatus('error')
    }
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Contact Us</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input id="name" name="name" required />
        </div>

        <div>
          <Label htmlFor="email">Email *</Label>
          <Input id="email" name="email" type="email" required />
        </div>

        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" />
        </div>

        <div>
          <Label htmlFor="message">Message *</Label>
          <Textarea id="message" name="message" rows={5} required />
        </div>

        <Button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Sending...' : 'Send Message'}
        </Button>

        {status === 'success' && (
          <p className="text-green-600">Message sent successfully!</p>
        )}
        {status === 'error' && (
          <p className="text-red-600">Failed to send message. Please try again.</p>
        )}
      </form>
    </div>
  )
}



