import {makeStyles} from "@mui/styles";

const profileStyles = makeStyles({
    imgage:{
        width: 200,
        height: 200,
    },
    imgContainer:{
        width: 100,
        height: 100,
        borderRadius: 100
    }
});

const boxStyle = {
        marginTop: 8,
        display: "flex",
        alignItems: "center"
}

export {
    profileStyles,
    boxStyle
}
