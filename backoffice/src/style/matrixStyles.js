import {makeStyles} from "@mui/styles";

const matrixStyles = makeStyles({
    headerCell: {
        fontSize: 16,
        textAlign: 'center',
        color: 'black',
        fontWeight: 'bold',
    },
    row: {
        '&:nth-of-type(odd)': {
            backgroundColor: '#B8B8B8',
        },
        '&:last-child td, &:last-child th': {
            border: 0,
        },

    },
});

export {
    matrixStyles
}