type Params = {
    user: string
  }
   
  export async function GET(request: Request, context: { params: Params }) {
    // const team = context.params.team // '1'
    return new Response('200')
  }