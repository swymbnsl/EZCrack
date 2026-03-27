import { revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidation-secret")

  if (!secret || secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 })
  }

  try {
    const body = await request.json()

    if (body.all) {
      // Revalidate the entire site
      revalidatePath("/", "layout")
    } else if (Array.isArray(body.paths) && body.paths.length > 0) {
      // Revalidate specific paths
      for (const path of body.paths) {
        if (typeof path === "string") {
          revalidatePath(path)
        }
      }
    } else {
      return NextResponse.json(
        { error: "Provide 'all: true' or 'paths: string[]'" },
        { status: 400 }
      )
    }

    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    )
  }
}
