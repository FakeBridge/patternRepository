export default {
    multiValue: (provided: any, state: any) => {
        const backgroundColor = `${state.data.colour}88`;

        return {
            ...provided,
            backgroundColor,
        };
    },
};
