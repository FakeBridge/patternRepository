export type user = userInfo | null;

export type userInfo = {
    uid: string | null;
    email: string | null;
    username: string | null;
    avatar: string | null;
    description: string | null;
    darkTheme?: boolean;
};

export type basicUser = {
    uid: string | null;
    username: string | null;
    avatar: string | null;
};

export type pattern = {
    id: string;
    title: string | null;
    description: string | null;
    difficulty: number;
    owner?: basicUser;
    patternImages: basicImage[];
    finishedWorkImages: basicImage[];
    tags: tag[];
    books: book[];
    likes: number;
    dateCreated?: number;
};

export type patternToAdd = {
    title: string | null;
    description: string | null;
    difficulty: number | null;
    owner?: string | null;
    patternImages: basicImage[];
    finishedWorkImages: basicImage[];
    tags: string[];
    books: string[];
    likes: number;
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

export type book = {
    id: string;
    label: string;
    value: string;
    colour: string;
    owner: string | null;
    patterns?: pattern[];
};

export type bookInfo = {
    label: string;
    value?: string;
    colour: string;
    owner?: string | null;
};
