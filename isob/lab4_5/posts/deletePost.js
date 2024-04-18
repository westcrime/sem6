const deletePost = async (db, postId) => {
    try {
        const response = await db.collection('posts').doc(postId).delete();
        return {success: true};
    } catch (error) { 
        return {success: false, description: `${error}`};
    }
}

export default deletePost;