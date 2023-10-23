import { signJwtAccessToken } from "@/lib/jwt";
import prisma from "@/prisma/prisma";
import * as bcrypt from "bcrypt";

interface RequestBody {
  username: string;
  password: string;
}
export async function POST(request: any) {

  try {
    const body: any = await request.json();
    const user: any = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if(user === null || undefined){
      const res: any = new Response(JSON.stringify('user not found'), { status: 404 });
      return res
    }

    if (user && (await bcrypt.compare(body.password, user.password))) {
      const { password, ...userWithoutPass } = user;
      const accessToken = signJwtAccessToken(userWithoutPass);
      const result = {
        ...userWithoutPass,
        accessToken,
      };
      return new Response(JSON.stringify(result));

    } else {
      const res: any = new Response(JSON.stringify('password do not match'), { status: 404 });
      return res
    }

  } catch (error) {
    const res: any = new Response(JSON.stringify(error));
    return res
  }


}
