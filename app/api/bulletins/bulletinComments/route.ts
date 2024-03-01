import { getBulletinComments, } from "@/app/services/bulletinBoardService";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const bulletinBoardId = req.nextUrl.searchParams.get("bulletinBoardId");
    if (bulletinBoardId) {
        let res = await getBulletinComments(bulletinBoardId)
        return Response.json(res);
    } else {
        return Response.json('bulletinBoardId not found!')
    }
}