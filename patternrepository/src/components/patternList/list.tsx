import React, { useState, useContext, useMemo } from 'react';
import { firestore } from '../../logic/firebase';
import { UserContext } from '../../logic/providers/userProvider';

import { pattern as patternType } from '../../logic/types';

const List: React.FC = () => {
    const { user } = useContext(UserContext);

    const [patterns, setPatterns] = useState<patternType[]>([]);
    console.log('HI');

    const b = useMemo(
        () => async () => {
            const ref = firestore.collection(`patterns`);
            const snap = await ref.where('owner', '==', user?.uid).get();
            console.log('inside');
            console.log(snap);
            if (snap.empty) {
                console.log('No matching documents.');
                return;
            }

            let a: patternType[] = [];
            a = [];

            console.log(snap);

            snap.forEach((doc) => {
                console.log(doc.id, '=>', doc.data());
                a.push({
                    title: doc.data().title,
                    description: doc.data().description,
                    difficulty: doc.data().difficulty,
                    owner: doc.data().owner,
                    id: doc.id,
                });
            });
            setPatterns(a);
        },
        [user],
    );

    console.log(b, patterns);

    return (
        <div>
            {patterns.map((pattern: patternType) => (
                <div key={pattern.id}>{pattern.title}</div>
            ))}

            <p>HI</p>
        </div>
    );
};

export default List;
