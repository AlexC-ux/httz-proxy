import { Prisma, PrismaClient } from '@prisma/client'
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
 
type ResponseData = {
  requests:Prisma.requestGetPayload<{include:{response:false}}>[]
}
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
    const prisma = new PrismaClient();
    const requests:Prisma.requestGetPayload<{include:{response:false}}>[] = await prisma.request.findMany({
        orderBy:{
            created_at: 'desc'
        }
    })
    res.json({
        requests:requests
    })
}