import { firestore } from '../firebase';
import { noteToAdd } from '../types';

const collectionRef = firestore.collection('/notes');

const getAll = () => {
    return collectionRef;
};

const create = (data: noteToAdd) => {
    return collectionRef.add(data);
};

const update = (id: string, value: noteToAdd) => {
    return collectionRef.doc(id).update(value);
};

const set = (id: string, value: noteToAdd) => {
    return collectionRef.doc(id).set(value);
};

const remove = (id: string) => {
    return collectionRef.doc(id).delete();
};

const NoteService = {
    getAll,
    set,
    create,
    update,
    remove,
};

export default NoteService;
