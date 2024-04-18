import jwt from 'jsonwebtoken';
import * as crypto from 'crypto'

const login = async (userData, jwtSecretKey, db) => {
    const { email, password } = userData;
    const response = await db.collection('users').get();
    let responseArr = [];
    response.forEach(doc => {
        responseArr.push(doc.data());
    });
    const user = responseArr.find(user => user.email === email);

    // If found, compare the hashed passwords and generate the JWT token for the user
    const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
    if (user !== undefined) {
        if (hashedPassword !== user.password) {
            return { success: false, description: 'Wrong password' };
        } else {
            let loginData = {
                email,
                signInTime: Date.now(),
            }
            console.log(loginData);
            console.log("Creating token...");
            try {
                const token = jwt.sign(loginData, jwtSecretKey);
                console.log("Token created:", token);
                return { success: true, token };
            } catch (error) {
                console.error("Error creating token:", error);
                return { success: false, description: 'Error creating token' };
            }
        }
        // If no user is found, hash the given password and create a new entry in the login db with the email and hashed password
    } else {
        return { success: false, description: 'No user found'};
        // console.log({ email, password: hashedPassword});
        // const response = db.collection('users').doc(email).set({email: email, password: hashedPassword, role: 'default'});
        //
        // let loginData = {
        //     email,
        //     signInTime: Date.now(),
        // }
        //
        // const token = jwt.sign(loginData, jwtSecretKey)
        // res.status(200).json({ success: true, token })
    }
}

export default login;