import { firestore } from '../firebase';

const collectionRef = firestore.collection('/likedPatterns');

const getAll = () => {
    return collectionRef;
};

const setLiked = (id: string, value: string[]) => {
    return collectionRef.doc(id).set({ patterns: value });
};

const LikedPatternsService = {
    getAll,
    setLiked,
};

export default LikedPatternsService;
