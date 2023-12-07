import bcrypt from "bcrypt";
export const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const passwordLength = Math.floor(Math.random() * 3) + 8; // 8~10 사이의 길이
    let password = '';
    for (let i = 0; i < passwordLength; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
    }
    return password;
};
export const hashPassword = async (password: string) => {
    const saltFactor = process.env.SALT_WORK_FACTOR || 10;
    var sf: number = + saltFactor;
    const salt = await bcrypt.genSalt(sf);
    const hash = await bcrypt.hashSync(password, salt);
    return hash;
}