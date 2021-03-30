export type user = userInfo | null;

type userInfo = {
    uid: string | null;
    email: string | null;
    username: string | null;
    avatar: string | null;
    description: string | null;
};
