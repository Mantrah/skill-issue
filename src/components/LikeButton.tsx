'use client'

import { useState } from 'react'

interface LikeButtonProps {
  initialLikes?: number
}

export default function LikeButton({ initialLikes = 0 }: LikeButtonProps) {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(initialLikes)

  const toggleLike = () => {
    if (liked) {
      setLikes(likes - 1)
    } else {
      setLikes(likes + 1)
    }
    setLiked(!liked)
  }

  return (
    <button
      onClick={toggleLike}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
        liked
          ? 'bg-red-500/10 border-red-500/30 text-red-500'
          : 'bg-card border-card-border text-muted hover:border-red-500/30 hover:text-red-500'
      }`}
    >
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill={liked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <span className="font-medium">{likes}</span>
    </button>
  )
}
