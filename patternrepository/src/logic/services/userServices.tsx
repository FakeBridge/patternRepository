import { firestore } from '../firebase';

const collectionRef = firestore.collection('/users');

const getAll = () => {
    return collectionRef;
};

const UserService = {
    getAll,
};

export default UserService;
