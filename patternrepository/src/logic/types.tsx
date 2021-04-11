export type user = userInfo | null;

type userInfo = {
    uid: string | null;
    email: string | null;
    username: string | null;
    avatar: string | null;
    description: string | null;
};

export type basicUser = {
    uid: string | null;
    username: string | null;
    avatar: string | null | basicImage | fileWithUrl;
};

export type pattern = {
    id: string | null;
    title: string | null;
    description: string | null;
    difficulty: number | null;
    owner: string | null | basicUser;
    patternImages: basicImage[];
    finishedWorkImages: basicImage[];
};

export type patternToAdd = {
    title: string | null;
    description: string | null;
    difficulty: number | null;
    owner: string | null;
    patternImages: basicImage[];
    finishedWorkImages: basicImage[];
};

export type basicImage = {
    name: string;
    url: string;
};

export type fileWithUrl = {
    file: File;
    url: string;
};
