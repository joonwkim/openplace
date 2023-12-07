'use server';
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { cookies } from 'next/headers';
import { createUser, getUserByEmail, getUserById, updateUser, updateUserPassword } from "../services/userService";
import { generatePassword, hashPassword } from "../lib/password";
import { sendMail } from "../lib/mailServer";
const jwt = require('jsonwebtoken');

export async function getUserByIdAction(id: string) {
    await getUserById(id);
    revalidatePath('/');
}

export async function createUserAction(input: any) {
    try {
        input.password = await hashPassword(input.password);
        delete input.passwordConfirmation;
        const userExist = await getUserByEmail(input.email);
        if (userExist) return 'email is being useed, use other email';
        input.roles = ['USER'];
        input.provider = 'credentials';

        const createdUser = await createUser(input);
        if (!createdUser) return 'user not created';

    } catch (error) {
        return ('user not created');
    }
}

export async function sendNewPasswordAction(email: string) {
    console.log('email in sendNewPasswordAction:', email)
    var user: any = await getUserByEmail(email);
    if (user) {
        const newPassword = generatePassword();
        const passwordHashed = await hashPassword(newPassword);
        const result = await updateUserPassword(email, passwordHashed);

        sendMail(email, newPassword)
        return true;
    }
    else {
        return false
    }
}

export async function findUserAction(email: any) {
    try {
        var user: any = await getUserByEmail(email);
        if (!user) return 'user not registered';
        if (user.googleLogin) return 'googleLoginUser'
        return 'user';

    } catch (error: any) {
        console.log('findUserAction error: ', error);
        return 'user not registered';
    }
}
export async function loginAction(input: any) {
    try {
        var user: any = await getUserByEmail(input.email);
        // console.log('user: ', user);
        if (!user) return 'user not registered';
        const result = await bcrypt.compare(input.password, user.password).catch((e) => false);
        if (!result) {
            const errorMessage = 'password do not match';
            return errorMessage;
        }
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "name": user.name,
                    "email": user.email,
                    "roles": user.roles ? user.roles : [],
                    "image": user.image,
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESSTOKEN_VALID_UNTIL }
        );

        const newRefreshToken = jwt.sign(
            { "email": user.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESHTOKEN_VALID_UNTIL }
        );
        const ass_tok = cookies().get('ass_tok');
        return user;
    } catch (error: any) {
        console.log('loginAction error: ', error);
        const errorMessage = error.response.data.message;
        throw new Error('loginAction error:' + errorMessage);
    }
}
export async function updateUserAction(id: string, input: any) {
    await updateUser(id, input);
    revalidatePath('/');
}


