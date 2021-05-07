import { firestore } from '../firebase';

const collectionRef = firestore.collection('/followedUsers');

const getAll = () => {
    return collectionRef;
};

const setFollowed = (id: string, value: string[]) => {
    return collectionRef.doc(id).set({ users: value });
};

const FollowedUsersService = {
    getAll,
    setFollowed,
};

export default FollowedUsersService;
