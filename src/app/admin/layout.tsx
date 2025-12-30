import Link from 'next/link'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b border-card-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link href="/admin" className="text-lg font-bold text-foreground">
              Admin Panel
            </Link>
            <div className="flex gap-1">
              <NavLink href="/admin">Articles</NavLink>
              <NavLink href="/admin/comments">Comments</NavLink>
              <NavLink href="/admin/likers">Likers</NavLink>
              <NavLink href="/admin/news">News RSS</NavLink>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      {children}
    </div>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 text-sm text-muted hover:text-foreground hover:bg-card-border/30 rounded-md transition-colors"
    >
      {children}
    </Link>
  )
}
