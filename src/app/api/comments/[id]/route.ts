import { NextRequest, NextResponse } from 'next/server'
import { deleteComment, updateComment } from '@/lib/comments'

interface RouteParams {
  params: Promise<{ id: string }>
}

// DELETE /api/comments/[id]?slug=article-slug
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  if (!slug) {
    return NextResponse.json(
      { error: 'Missing slug parameter' },
      { status: 400 }
    )
  }

  const deleted = deleteComment(slug, id)

  if (!deleted) {
    return NextResponse.json(
      { error: 'Comment not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({ success: true })
}

// PATCH /api/comments/[id]
// Body: { slug, likes?, content? }
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params

  try {
    const body = await request.json()
    const { slug, ...updates } = body

    if (!slug) {
      return NextResponse.json(
        { error: 'Missing slug parameter in body' },
        { status: 400 }
      )
    }

    // Only allow updating certain fields
    const allowedUpdates = ['likes', 'content'] as const
    const sanitizedUpdates: Record<string, unknown> = {}

    for (const key of allowedUpdates) {
      if (key in updates && updates[key] !== undefined) {
        sanitizedUpdates[key] = updates[key]
      }
    }

    if (Object.keys(sanitizedUpdates).length === 0) {
      return NextResponse.json(
        { error: 'No valid updates provided' },
        { status: 400 }
      )
    }

    const updated = updateComment(slug, id, sanitizedUpdates)

    if (!updated) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ comment: updated })
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}
