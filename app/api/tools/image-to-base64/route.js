import handler from '@server/api/tools/image-to-base64'
import { createPagesApiRouteHandler } from '@utils/pagesApiRouteHandler'

export const dynamic = 'force-dynamic'

const routeHandler = createPagesApiRouteHandler(handler)

export const GET = routeHandler
export const POST = routeHandler
export const PUT = routeHandler
export const PATCH = routeHandler
export const DELETE = routeHandler
export const HEAD = routeHandler
export const OPTIONS = routeHandler