import jwt from 'jsonwebtoken';
import * as crypto from 'crypto'

const checkAccount = async (db, email) => {
    const response = await db.collection('users').get();
    let responseArr = [];
    response.forEach(doc => {
        responseArr.push(doc.data());
    });
    const user = responseArr.find(user => user.email === email);

    if (user !== undefined) {
        return { success: true, user: user};
    } else {
        return { success: false, description: 'No user found'};
    }
}

export default checkAccount;