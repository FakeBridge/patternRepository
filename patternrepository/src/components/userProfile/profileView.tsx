import React, { useContext } from 'react';
import { Button, UncontrolledCarousel } from 'reactstrap';

import { UserContext } from '../../logic/providers/userProvider';

import noAvatar from '../../design/images/no-image-icon.png';

interface PropsType {
    openEdit: (open: boolean) => void;
}

const items = [
    {
        src:
            'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15ba800aa1d%20text%20%7B%20fill%3A%23555%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15ba800aa1d%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22285.921875%22%20y%3D%22218.3%22%3EFirst%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
        altText: 'Image could not be showcased',
        header: 'You have no images to show here yet :c',
        key: '1',
    },
];

const ProfileView: React.FC<PropsType> = ({ openEdit }) => {
    const { user } = useContext(UserContext);

    const image: string | null = user?.avatar ? user.avatar : noAvatar;

    return (
        <div style={{ maxWidth: '60%', margin: '0px auto' }}>
            This is how other users see you profile. Click{' '}
            <Button
                onClick={() => openEdit(true)}
                color="link"
                style={{ padding: '0', lineHeight: '1em' }}
            >
                here
            </Button>{' '}
            to edit your profile.
            <div style={{ width: '100%', marginBottom: '20px' }}>
                <UncontrolledCarousel items={items} />
            </div>
            <div>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    <img src={image} alt="avatar" width="100px" height="100px" />
                    <h1
                        style={{ alignSelf: 'center', marginLeft: 'auto', marginRight: 'auto' }}
                    >{`${user?.username}`}</h1>
                    <Button
                        onClick={() => {}}
                        color="info"
                        style={{ height: '2em', padding: '0px 10px' }}
                    >
                        Follow
                    </Button>
                </div>
                <p>Patterns: 0</p>
                <p>Repositories: 0</p>
                <p>Followers: 0</p>
                <p>Follows: 0</p>
            </div>
            <h2>Recent patterns</h2>
            <div>You have no patterns</div>
            <h2>Repositories</h2>
            <div>You have no repositories</div>
            <h2>Followed users</h2>
            <div>You follow no users</div>
        </div>
    );
};

export default ProfileView;
