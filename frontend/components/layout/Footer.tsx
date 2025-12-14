import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 mb-4 md:mb-0">
            © {new Date().getFullYear()} Restroworks. All rights reserved.
          </p>
          <nav className="flex gap-6">
            <Link href="/en" className="text-gray-600 hover:text-gray-900">
              Privacy Policy
            </Link>
            <Link href="/en" className="text-gray-600 hover:text-gray-900">
              Terms of Service
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}



