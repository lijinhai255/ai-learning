// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  id: number;
  name: string;
}[];

// 正常情况，这些数据应该是从数据库中读取

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // res.status(200).json({ name: "John Doe" });
  res.status(200).json([
    {
      id: 1,
      name: "Heyi",
    },
    {
      id: 2,
      name: "Jane Doe",
    },
  ]);
}
