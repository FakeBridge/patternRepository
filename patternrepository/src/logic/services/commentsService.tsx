import { firestore } from '../firebase';

import { commentToAdd } from '../types';

const collectionRef = firestore.collection('/comments');

const getAll = () => {
    return collectionRef;
};

const create = (data: commentToAdd) => {
    return collectionRef.add(data);
};

const update = (id: string, value: commentToAdd) => {
    return collectionRef.doc(id).update(value);
};

const set = (id: string, value: commentToAdd) => {
    return collectionRef.doc(id).set(value);
};

const remove = (id: string) => {
    return collectionRef.doc(id).delete();
};

const CommentsService = {
    getAll,
    set,
    create,
    update,
    remove,
};

export default CommentsService;
