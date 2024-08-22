import { Prisma, PrismaClient } from "@prisma/client";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export type GetRequestsResponseData = {
  requests: Prisma.requestGetPayload<{ include: { response: false } }>[];
  totalCount: number;
  page: number;
  pageSize: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetRequestsResponseData>
) {
  const page = req.query.page ? Number(req.query.page) : 1;
  const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 100;
  const prisma = new PrismaClient();
  const requests: Prisma.requestGetPayload<{ include: { response: false } }>[] =
    await prisma.request.findMany({
      orderBy: {
        created_at: "desc",
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
      include: {
        response: true,
      },
    });
  const totalCount = await prisma.request.count();
  res.json({
    requests: requests,
    page,
    pageSize,
    totalCount,
  });
}
