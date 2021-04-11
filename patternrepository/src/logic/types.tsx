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
    id: string;
    title: string | null;
    description: string | null;
    difficulty: number;
    owner?: string | null | basicUser;
    patternImages: basicImage[];
    finishedWorkImages: basicImage[];
    tags?: tag[];
};

export type patternToAdd = {
    title: string | null;
    description: string | null;
    difficulty: number | null;
    owner?: string | null;
    patternImages: basicImage[];
    finishedWorkImages: basicImage[];
    tags?: string[];
};

export type basicImage = {
    name: string;
    url: string;
};

export type fileWithUrl = {
    file: File;
    url: string;
};

export type tag = {
    id: string;
    label: string;
    value?: string;
};

export type tagToAdd = {
    label: string;
};
