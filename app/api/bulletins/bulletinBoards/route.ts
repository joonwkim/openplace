import { getBulletinBoards, getBulletins, } from "@/app/services/bulletinBoardService";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const knowhowId = req.nextUrl.searchParams.get("knowhowId");
    if (knowhowId) {
        let res = await getBulletins(knowhowId)
        return Response.json(res);
    } else {
        return Response.json('knowhowId not found!')
    }
}