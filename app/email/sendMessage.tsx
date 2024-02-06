// import type { NextApiRequest, NextApiResponse } from 'next';
// import prisma from '../../prisma/prisma';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     const { message, senderId } = req.body;
//     try {
//       const result = await prisma.message.create({
//         data: {
//           message,
//           creator: {
//             connect: { id: senderId },
//           },
//         },
//       });
//       res.status(200).json(result);
//     } catch (error) {
//       res.status(500).json({ error: "Unable to send message" });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }