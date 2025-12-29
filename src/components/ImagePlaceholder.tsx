import { categoryConfig, type Category } from '@/lib/categories'

interface ImagePlaceholderProps {
  category: Category
  className?: string
}

export default function ImagePlaceholder({ category, className = '' }: ImagePlaceholderProps) {
  const config = categoryConfig[category]

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{ backgroundColor: config.bgLight }}
    >
      {/* Pattern géométrique */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.15]"
        style={{ color: config.color }}
      >
        <defs>
          <pattern id={`grid-${category}`} width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
            <circle cx="0" cy="0" r="2" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${category})`} />
      </svg>

      {/* Contenu central */}
      <div className="relative text-center z-10" style={{ color: config.color }}>
        <span className="text-lg font-bold uppercase tracking-wider">
          {config.label}
        </span>
      </div>

      {/* Barre colorée en bas */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{ backgroundColor: config.color }}
      />
    </div>
  )
}
