export const dynamic = 'force-dynamic'

export function GET() {
  return Response.json(
    {
      success: false,
      data: {
        error: {
          type: 'UNSUPPORTED_IN_APP_ROUTER',
          message:
            'Socket.IO initialization through Next.js API route is not supported in App Router.',
        },
      },
    },
    { status: 501 }
  )
}

export const POST = GET
export const PUT = GET
export const PATCH = GET
export const DELETE = GET
export const HEAD = GET
export const OPTIONS = GET
