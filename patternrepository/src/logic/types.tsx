export type user = userInfo | null;

export type userInfo = {
    uid: string | null;
    email: string | null;
    username: string | null;
    avatar: string | null;
    description: string | null;
    darkTheme?: boolean;
    hasUnreadNotes: boolean;
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
    comments: number;
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
    likes?: number;
    dateCreated?: number;
    comments?: number;
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

export type comment = {
    id: string;
    patternId: string;
    message: string;
    by?: userInfo;
    dateCreated: number;
};

export type commentToAdd = {
    patternId: string;
    message: string;
    by: string;
    dateCreated: number;
};

export type note = {
    id: string;
    by?: userInfo;
    message: string;
    dateCreated: number;
    to?: userInfo;
    seen: boolean;
};

export type noteToAdd = {
    by: string;
    message: string;
    dateCreated: number;
    to: string;
    seen: boolean;
};
