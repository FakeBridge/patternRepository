import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';



if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // if already initialized, use that one
}

// firebase.initializeApp();
export const auth = firebase.auth();
export const firestore = firebase.firestore();

const getUserDocument = async (uid: any) => {
    if (!uid) return null;
    try {
        const userDocument = await firestore.doc(`users/${uid}`).get();
        return {
            uid,
            ...userDocument.data(),
        };
    } catch (error) {
        console.error('Error fetching user', error);
        return null;
    }
};

export const generateUserDocument = async (user: any, additionalData: any) => {
    if (!user) return {};
    const userRef = firestore.doc(`users/${user.uid}`);
    const snapshot = await userRef.get();
    if (!snapshot.exists) {
        const { email } = user;
        try {
            await userRef.set({
                username: user.username,
                email,
                ...additionalData,
            });
        } catch (error) {
            console.error('Error creating user document', error);
        }
    }
    return getUserDocument(user.uid);
};
