'use server'
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache"
import { cookies } from 'next/headers';
import { createUser, getUserByEmail, updateUser } from "../services/userService";
const jwt = require('jsonwebtoken')


async function hashPassword(password: string) {
    const saltFactor = process.env.SALT_WORK_FACTOR || 10
    var sf: number = + saltFactor
    const salt = await bcrypt.genSalt(sf);
    const hash = await bcrypt.hashSync(password, salt);
    return hash
}

export async function createUserAction(input: any) {
    try {

        input.password = await hashPassword(input.password)
        delete input.passwordConfirmation
        const userExist = await getUserByEmail(input.email);
        if (userExist) return 'email is being useed, use other email'
        input.roles = ['USER']
        input.provider = 'credentials'

        const createdUser = await createUser(input)
        if (!createdUser) return 'user not created'

    } catch (error) {
        return ('user not created')
    }
}

export async function loginAction(input: any) {
    try {
        var user:any = await getUserByEmail(input.email)
        if (!user) return 'user not registered'
        const result = await bcrypt.compare(input.password, user.password).catch((e) => false);
        if (!result){
            const errorMessage = 'password do not match'
            return errorMessage;
        }  
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "name": user.name,
                    "email": user.email,
                    "roles": user.roles,
                    "image": user.image,
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESSTOKEN_VALID_UNTIL }
        )

        const newRefreshToken = jwt.sign(
            { "email": user.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESHTOKEN_VALID_UNTIL }
        );
        const ass_tok = cookies().get('ass_tok')
        return user
    } catch (error:any) {
        const errorMessage = error.response.data.message;
        throw new Error(errorMessage);
    }
}
export async function updateUserAction(id: string, input: any) {
    await updateUser(id, input)
    revalidatePath('/')
}