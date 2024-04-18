
const getPosts = async (db) => {
    try {
        const response = await db.collection('posts').get();
        let responseArr = [];
        response.forEach(doc => {
            responseArr.push(doc.data());
        });
        return {success: true, posts: responseArr};
    } catch (error) { 
        return {success: false, description: `${error}`};
    }
}

export default getPosts;