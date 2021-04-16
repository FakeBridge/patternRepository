import styled from 'styled-components';

import patternbkg from './images/pattern-bkg.jpg';
import patternbkgDark from './images/pattern-bkg-dark.jpg';

const darkTheme = true;

const mainColourLight = '#FFF';
const mainColourDark = '#1a232f'; // '#2D3142';
const accentColourLight = '#F2EFEA';
const accentColourDark = '#4F5D76';
const dangerColour = '#DB7093';
const successColour = '#729B79';

const difficulties: string[] = ['#729B79', '#8c9080', '#a78586', '#c17b8d', '#DB7093'];
// const difficulties02: string[] = ['#729B79', '#74a8ab', '#757abb', '#b973cb', '#DB7093'];

let mainColour = mainColourLight;
let secondaryColor = mainColourDark;
let accentColor = accentColourLight;
let fontColour = accentColourDark;
if (darkTheme) {
    mainColour = mainColourDark;
    secondaryColor = mainColourLight;
    fontColour = accentColourLight;
    accentColor = accentColourDark;
}

export const Body = styled.main`
    width: 100ww;
    height: 100vh;
    background: url(${darkTheme ? patternbkgDark : patternbkg});
    background-size: cover;
`;

export const Main = styled.section`
    width: 60%;
    margin: 0px auto;
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

export const SearchCard = styled(Card)`
    margin: 2em 0px;
    padding: 1em;
`;

export const Tabs = styled.nav`
    width: 100%;
    list-style: none;
    padding: 0em;
`;

export const Tab = styled.a<{ active: boolean }>`
    height: 2em;
    display: inline-block;
    list-style: none;
    width: 50% !important;
    vertical-align: middle;
    text-align: center;
    color: ${fontColour} !important;
    text-decoration: none !important;
    font-size: 1.5em;
    ${(props) =>
        props.active &&
        `
      font-weight: bold;
      `};
    ${(props) =>
        !props.active &&
        `
        background-color: ${accentColor}
        `};
    &:hover {
        cursor: pointer;
    }
`;

export const Button = styled.button<{ block: boolean }>`
    width: ${(props) => (props.block ? '100%' : '100px')};
    height: 2em;
    border-radius: 5px;
    &:hover {
        cursor: pointer;
    }
`;

export const SuccessButton = styled(Button)`
    background-color: transparent;
    color: ${successColour};
    border: 1px solid ${successColour};

    &:hover {
        background-color: ${successColour};
        color: ${mainColour};
        border: 1px solid ${successColour};
    }
`;

export const DangerButton = styled(Button)`
    background-color: transparent;
    color: ${dangerColour};
    border: 1px solid ${dangerColour};

    &:hover {
        background-color: ${dangerColour};
        color: ${mainColour};
        border: 1px solid ${dangerColour};
    }
`;

export const CancelButton = styled(Button)`
    background-color: transparent;
    color: ${accentColourDark};
    border: 1px solid ${accentColourDark};

    &:hover {
        background-color: ${accentColourDark};
        color: ${mainColour};
        border: 1px solid ${accentColourDark};
    }
`;

export const LinkButton = styled(Button)`
    height: 1em;
    width: auto !important;
    padding: 0px;
    background-color: transparent;
    color: ${accentColourDark};
    border: none;
    text-decoration: underline;
`;

export const IconButton = styled.button`
    height: 1.5em;
    width: 1.5em;
    padding: 0px;
    background-color: ${dangerColour}44;
    color: ${dangerColour};
    border-radius: 1em;
    border: 2px solid ${dangerColour};
    font-size: 1.5em;
    text-decoration: none;
    position: absolute;
    top: 5px;
    right: 5px;

    svg {
        vertical-align: inherit;
    }
`;

export const Input = styled.input<{ block: boolean }>`
    width: ${(props) => (props.block ? '100%' : '50px')};
    height: 2em;
    padding-left: 0.4em;
    padding-right: 0.4em;
    border-radius: 5px;
    border: 1px solid ${fontColour};
    outline: none !important;
    color: ${fontColour};
    background-color: ${mainColour};
    &:focus {
        background-color: ${accentColor};
    }
    ::placeholder {
        color: ${fontColour};
    }
`;

export const DifficultyInput = styled(Input)<{ difficulty: number }>`
    background: linear-gradient(to right, #729b79, #8c9080, #a78586, #c17b8d, #db7093);
    border: none;
    height: 0.5em;
    outline: none;
    transition: background 450ms ease-in;
    -webkit-appearance: none;

    ::-webkit-slider-thumb {
        -webkit-appearance: none;
        -moz-appearance: none;
        -webkit-border-radius: 5px;
        /*16x16px adjusted to be same as 14x14px on moz*/
        height: 1em;
        width: 1em;
        border-radius: 5px;
        background: ${accentColor};
        border: 1px solid ${secondaryColor};
    }

    ::-moz-range-thumb {
        -webkit-appearance: none;
        -moz-appearance: none;
        -moz-border-radius: 5px;
        height: 1em;
        width: 1em;
        background: ${accentColor};
        border: 1px solid ${secondaryColor};
    }

    ::-ms-thumb {
        height: 1em;
        width: 1em;
        background: ${accentColor};
        border: 1px solid ${secondaryColor};
    }
`;

export const Label = styled.label`
    color: ${secondaryColor};
    display: block;
`;

export const HelperText = styled.label`
    color: ${fontColour};
    height: 1em;
    font-size: 0.8em;
`;

export const Alert = styled.p`
    height: 2em;
    width: 100%;
    border-radius: 5px;
    text-align: center;
`;

export const SuccessAlert = styled(Alert)`
    color: ${successColour};
`;

export const DangerAlert = styled(Alert)`
    color: ${dangerColour};
`;

export const FormGroup = styled.form`
    display: block;
    margin-bottom: 1.5em;
`;

export const PageHeader = styled.div`
    background-color: ${mainColour};
    height: 4em;
    flex-flow: row nowrap;
    justify-content: flex-start;
    position: relative;
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
`;

export const HeaderName = styled.a`
    color: ${accentColourDark} !important;
    font-size: 1.5em;
    font-weight: bold;
    padding-right: 1em;
`;

export const Navigation = styled.nav`
    width: -webkit-fill-available;
    list-style: none;
    padding: 0em;
`;

export const NavItem = styled.span`
    display: inline-block;
    list-style: none;
    width: auto;
    height: 2em;
    text-align: center;
    padding-right: 1em;
    &:hover {
        cursor: pointer;
    }
`;

export const NavLink = styled.a`
    color: ${fontColour} !important;
    font-size: 1em;
    vertical-align: sub;
`;

export const ItemList = styled.ul`
    padding: 0px;
`;

export const Item = styled.li`
    max-width: 33%;
    min-width: 20%;
    display: inline-block;
    vertical-align: top;
    margin: 0px;
    padding: 0em 2em 2em 0em;
    &:last-child,
    &:nth-child(3) {
        padding-right: 0em;
    }
`;

export const ItemDetail = styled(Card)`
    padding: 1em;
    img {
        display: inline;
        object-fit: cover;
        heigth: 100px;
        width: 49%;
        margin: 0px 1% 1% 0px;
        &:last-child {
            margin-right: 0em;
        }
    }
`;

export const MarginItemDetail = styled(ItemDetail)`
    margin: 2em 0em;
`;

export const ProfileHeader = styled.section`
    color: ${fontColour};
    align-items: center;
    display: flex;
    justify-content: space-between;
    h1 {
        margin: 0em;
    }
    img {
        display: inline;
        object-fit: cover;
        heigth: 100px;
        width: 100px;
    }
`;

export const ItemHeader = styled.h1`
    color: ${fontColour};
    font-size: 2em;
`;

export const ItemLabel = styled.h2`
    color: ${fontColour};
    font-size: 1.5em;
    margin-top: 1em;
`;

export const ButtonRow = styled.section`
    width: 100%;
    display: block;
    margin: 0px;

    display: flex;
    justify-content: space-between;
`;

export const Difficulty = styled.hr<{ difficulty: number }>`
    border: 5px solid ${(props) => difficulties[props.difficulty - 1]};
    border-radius: 5px;
`;

export const TagRow = styled.section`
    width: 100%;
    display: block;
    margin: 1em 0px;
`;

export const Tag = styled.li<{ colour: string }>`
    height: 1em;
    display: inline;
    background-color: ${(props) => (props.colour === 'tag' ? accentColourDark : props.colour)};
    color: ${accentColourLight};
    font-size: 0.8em;
    border-radius: 5px;
    padding: 2px 5px;
    margin-right: 0.5em;
`;

export const Description = styled.section`
    background-color: ${accentColor};
    color: ${fontColour};
    padding: 0.5em;
    border-radius: 5px;
`;

export const FormImageContainer = styled.section`
    width: 100%;
    height: 200px;
    position: relative;
    margin-bottom: 0.2em;
    img {
        display: inline;
        object-fit: cover;
        height: 200px;
        width: 100%;
        margin: 0px 1% 1% 0px;
    }
`;
