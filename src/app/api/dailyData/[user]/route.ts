const item1 = {
    id: '3849h48fq',
    name: 'Banana',
    serving: 53,
    calories: 100,
    protein: 2.5,
    fibre: 4,
    isDirectEntry: false
  };
  const item2 = {
    id: 'f43aqf',
    name: 'Apple',
    serving: 75,
    calories: 750,
    protein: 0.5,
    fibre: 1,
    isDirectEntry: true
  };

  type Params = {
    user: string
  }
   
  export async function GET(request: Request, context: { params: Params }) {
    const dailyData = [item1, item2]
    const res = JSON.stringify(dailyData)
    return Response.json(res);
  }