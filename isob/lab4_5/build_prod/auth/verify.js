import jwt from 'jsonwebtoken';

const verify = async (jwtToken, jwtSecretKey) => {
    try {
        const verified = jwt.verify(jwtToken, jwtSecretKey);
        if (verified) {
            return ({ success: true});
        } else {
            // Access Denied
            return ({ success: false});
        }
    } catch (error) {
        // Access Denied
        return { status: 'Invalid auth', success: false }
    }
}

export default verify;