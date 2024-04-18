import { v4 as uuidv4 } from 'uuid';

const putPost = async (db, user, post) => {
    try {
        const uniqueId = uuidv4();
        const response = await db.collection('posts').doc(uniqueId).set({id: uniqueId, date: post.date, text: post.text, userEmail: user.email, role: user.role});
        return {success: true};
    } catch (error) { 
        return {success: false, description: `${error}`};
    }
}

export default putPost;