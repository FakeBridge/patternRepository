import { useState } from 'react';

import { storage } from '../firebase';

const useStorage = (file: File | null) => {
    const [progress, setProgress] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [url, setUrl] = useState<string | null>(null);

    // runs every time the file value changes
    const uploadImage = (storageName: string, pictureName: string) => {
        if (file) {
            // storage ref
            const storageRef = storage.ref(`${storageName}/${pictureName}`);

            storageRef.put(file).on(
                'state_changed',
                (snap) => {
                    // track the upload progress
                    const percentage = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                    setProgress(percentage);
                },
                (err) => {
                    setError(err.message);
                },
                async () => {
                    // get the public download img url
                    const downloadUrl = await storageRef.getDownloadURL();

                    // save the url to local state
                    setUrl(downloadUrl);
                },
            );
        }
    };

    return { progress, url, error, uploadImage };
};
export default useStorage;
