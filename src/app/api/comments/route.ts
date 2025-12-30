import { NextRequest, NextResponse } from 'next/server'
import { getCommentsBySlug, addComment, type Comment, type UserStatus } from '@/lib/comments'

// GET /api/comments?slug=article-slug
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  if (!slug) {
    return NextResponse.json(
      { error: 'Missing slug parameter' },
      { status: 400 }
    )
  }

  const comments = getCommentsBySlug(slug)
  return NextResponse.json({ comments })
}

// POST /api/comments
// Body: { slug, author, content, status?, replyTo? }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, author, content, status = 'user', replyTo = null } = body

    if (!slug || !author || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: slug, author, content' },
        { status: 400 }
      )
    }

    // Validate status
    const validStatuses: UserStatus[] = ['admin', 'bot', 'user']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be: admin, bot, or user' },
        { status: 400 }
      )
    }

    const newComment = addComment(slug, {
      author,
      content,
      date: new Date().toISOString(),
      likes: 0,
      status: status as UserStatus,
      replyTo
    })

    return NextResponse.json({ comment: newComment }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}
