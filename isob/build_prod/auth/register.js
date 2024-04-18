import jwt from 'jsonwebtoken';
import * as crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid';

const register = async (userData, jwtSecretKey, db) => {
    const { email, password } = userData;
    const response = await db.collection('users').get();
    let responseArr = [];
    response.forEach(doc => {
        responseArr.push(doc.data());
    });
    const user = responseArr.find(user => user.email === email);

    // If found, compare the hashed passwords and generate the JWT token for the user
    const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
    if (user === undefined) {
        console.log({ email, password: hashedPassword});
        const uniqueId = uuidv4();
        const response = db.collection('users').doc(uniqueId).set({id: uniqueId, email: email, password: hashedPassword, role: 'default'});

        return { success: true };
        // If no user is found, hash the given password and create a new entry in the login db with the email and hashed password
    } else {
        return { success: false, description: 'This email already exists'};
    }
}

export default register;