import { firestore, auth } from '../firebase';
import { patternToAdd } from '../types';

const collectionRef = firestore.collection('/patterns');

const getAll = () => {
    return collectionRef;
};

const getAllMine = () => {
    if (auth?.currentUser?.uid) {
        return collectionRef.where('owner', '==', auth.currentUser.uid);
    }
    return [];
};

const getAllOfUser = (uid: string) => {
    return collectionRef.where('owner', '==', uid);
};

const create = (data: patternToAdd) => {
    return collectionRef.add(data);
};

const update = (id: string, value: patternToAdd) => {
    return collectionRef.doc(id).update(value);
};

const set = (id: string, value: patternToAdd) => {
    return collectionRef.doc(id).set(value);
};

const updateLikes = (id: string, value: number) => {
    return collectionRef.doc(id).update({ likes: value });
};

const remove = (id: string) => {
    return collectionRef.doc(id).delete();
};

const PatternService = {
    getAll,
    getAllMine,
    getAllOfUser,
    set,
    updateLikes,
    create,
    update,
    remove,
};

export default PatternService;
