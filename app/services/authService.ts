const jwt = require('jsonwebtoken')

export const setAccessToken = ({name, email, image}:{name:string, email:string, image:string} ) =>{

    return jwt.sign(
        {
            "UserInfo": {
                "name": name,
                "email": email,
                // "roles": user.roles,
                "image": image,
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESSTOKEN_VALID_UNTIL }
    )
}
