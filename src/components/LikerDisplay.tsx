'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import type { Liker } from '@/lib/liker-matcher'

interface LikerDisplayProps {
  likers: Liker[]
  totalLikes: number
  userLiked?: boolean
}

export default function LikerDisplay({ likers, totalLikes, userLiked = false }: LikerDisplayProps) {
  const { t } = useLanguage()

  const effectiveLikes = userLiked ? totalLikes + 1 : totalLikes
  const liker1 = likers[0]
  const liker2 = likers[1]

  // 0 likes
  if (effectiveLikes === 0) {
    return (
      <span className="text-sm text-muted">
        {t.beFirstToLike}
      </span>
    )
  }

  // 1 like
  if (effectiveLikes === 1) {
    const name = userLiked ? 'Vous' : (liker1?.name || 'Quelqu\'un')
    return (
      <span className="text-sm text-foreground/80">
        <span className="font-semibold">{name}</span> {t.likes}
      </span>
    )
  }

  // 2 likes: "Elon Musk et Nintendo aiment"
  if (effectiveLikes === 2) {
    const name1 = liker1?.name || 'Quelqu\'un'
    const name2 = userLiked ? 'vous' : (liker2?.name || 'quelqu\'un')
    return (
      <span className="text-sm text-foreground/80">
        <span className="font-semibold">{name1}</span> {t.andName.replace('{name}', name2)} {t.likePlural}
      </span>
    )
  }

  // 3+ likes: "Elon Musk, Nintendo et X autres aiment"
  const name1 = liker1?.name || 'Quelqu\'un'
  const name2 = liker2?.name
  const othersCount = effectiveLikes - 2

  // Si on a 2 likers matchés, on affiche: "Name1, Name2 et X autres aiment"
  if (name2) {
    const othersText = othersCount === 1
      ? t.andOneLike
      : t.andOthersLike.replace('{count}', String(othersCount))

    return (
      <span className="text-sm text-foreground/80">
        <span className="font-semibold">{name1}</span>, <span className="font-semibold">{name2}</span> {othersText}
      </span>
    )
  }

  // Sinon, juste 1 nom + others
  const othersCountSingle = effectiveLikes - 1
  const othersTextSingle = othersCountSingle === 1
    ? t.andOneLike
    : t.andOthersLike.replace('{count}', String(othersCountSingle))

  return (
    <span className="text-sm text-foreground/80">
      <span className="font-semibold">{name1}</span> {othersTextSingle}
    </span>
  )
}
