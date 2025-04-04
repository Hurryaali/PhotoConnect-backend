import jwt from "next-auth/jwt"

export default async function federatedLogout(req, res) {
    try {
        const token = await jwt.getToken({ req, secret: process.env.SECRET, encryption: true })
        if (!token) {
            return res.redirect(process.env.NEXTAUTH_URL)
        }


        let endsessionURL = `${process.env.NEXTAUTH_URL}/connect/endsession`
        const endsessionParams = new URLSearchParams({
            id_token_hint: token.idToken,
            post_logout_redirect_uri: process.env.NEXTAUTH_URL,
        })
        return res.redirect(`${endsessionURL}?${endsessionParams}`)
    } catch (error) {
        res.redirect(process.env.NEXTAUTH_URL)
    }
}