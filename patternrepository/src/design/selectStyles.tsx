export default {
    multiValue: (provided: any, state: any) => {
        const backgroundColor = `${state.data.colour}88`;

        return {
            ...provided,
            backgroundColor,
        };
    },
};

export const searchStyle = {
    control: (base: any) => ({
        ...base,
        minHeight: 30,
        borderWidth: 0,
        borderRadius: '5px',
        backgroundColor: 'transparent !important',
        borderColor: 'transparent !important',
        boxShadow: 'none !important',
    }),
    dropdownIndicator: (base: any) => ({
        ...base,
        color: 'transparent',
        padding: 4,
    }),
    clearIndicator: (base: any) => ({
        ...base,
        padding: 4,
    }),
    multiValueLabel: (base: any) => ({
        ...base,
    }),
    multiValueRemove: (styles: any) => ({
        ...styles,
    }),
    menuList: (styles: any) => ({
        ...styles,
        backgroundColor: 'inherit !important',
    }),
    valueContainer: (base: any) => ({
        ...base,
        padding: '0px 6px',
        borderRadius: 0,
    }),
    input: (base: any) => ({
        ...base,
        margin: 0,
        padding: 0,
        backgroundColor: 'inherit',
        borderRadius: 0,
    }),
    indicatorSeparator: (base: any) => ({
        ...base,
        width: 0,
    }),
    placeholder: (base: any) => ({
        ...base,
    }),
    menu: (base: any) => ({
        ...base,
        zIndex: 50,
    }),
};
