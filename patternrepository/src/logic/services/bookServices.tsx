import { firestore, auth } from '../firebase';
import { bookInfo } from '../types';

const collectionRef = firestore.collection('/book');

const getAll = () => {
    return collectionRef;
};

const getAllMine = () => {
    if (auth?.currentUser?.uid) {
        return collectionRef.where('owner', '==', auth.currentUser.uid);
    }
    return collectionRef;
};

const getAllOfUser = (uid: string) => {
    return collectionRef.where('owner', '==', uid);
};

const create = (data: bookInfo) => {
    return collectionRef.add(data);
};

const update = (id: string, value: bookInfo) => {
    return collectionRef.doc(id).update(value);
};

const set = (id: string, value: bookInfo) => {
    return collectionRef.doc(id).set(value);
};

const remove = (id: string) => {
    return collectionRef.doc(id).delete();
};

const BookService = {
    getAll,
    getAllMine,
    getAllOfUser,
    set,
    create,
    update,
    remove,
};

export default BookService;
