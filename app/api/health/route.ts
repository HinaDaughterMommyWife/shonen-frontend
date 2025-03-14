export async function GET(): Promise<Response> {
  return Response.json({
    alive: true
  })
}
