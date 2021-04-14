import styled from 'styled-components';

import patternbkg from './images/pattern-bkg.jpg';
import patternbkgDark from './images/pattern-bkg-dark.jpg';

const darkTheme = false;

const mainColourLight = '#FFF';
const mainColourDark = '#1a232f'; // '#2D3142';
// const accentColourLight = '#F2EFEA';
// const accentColourDark = '#4F5D76';
// const dangerColour = '#DB7093';
// const successColour = '#729B79';

let mainColour = mainColourLight;
let secondaryColor = mainColourDark;
if (darkTheme) {
    mainColour = mainColourDark;
    secondaryColor = mainColourLight;
}

export const Main = styled.body`
    height: 100vh;
    width: 100vw;
    background: url(${darkTheme ? patternbkgDark : patternbkg});
    background-size: cover;
`;

export const Card = styled.section`
    background-color: ${mainColour};
    border: none;
    border-radius: 5px;
    box-shadow: 0px 0px 10px ${secondaryColor};
`;

export const LoginCard = styled(Card)`
    width: 40%;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%);
`;

export const Tabs = styled.nav`
    width: 100%;
    height: 3em;
    list-style: none;
    padding: 1em 0em;
`;

export const Tab = styled.a`
    display: inline-block;
    list-style: none;
    width: 50% !important;
    vertical-align: middle;
    text-align: center;
`;
