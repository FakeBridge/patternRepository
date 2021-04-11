import { firestore } from '../firebase';
import { tagToAdd } from '../types';

const collectionRef = firestore.collection('/tags');

const getAll = () => {
    return collectionRef;
};

const create = (data: tagToAdd) => {
    return collectionRef.add(data);
};

const update = (id: string, value: tagToAdd) => {
    return collectionRef.doc(id).update(value);
};

const set = (id: string, value: tagToAdd) => {
    return collectionRef.doc(id).set(value);
};

const remove = (id: string) => {
    return collectionRef.doc(id).delete();
};

const TagService = {
    getAll,
    set,
    create,
    update,
    remove,
};

export default TagService;
