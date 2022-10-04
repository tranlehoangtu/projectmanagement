import { useContext } from "react";
import { AuthStateContext } from "../Context/context";
import Customs from "../Styled/Customs";

const Navbar = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const stateAuth = useContext(AuthStateContext);

    if (stateAuth) {
    }

    return <>{currentUser && <Customs.MuiAppBar />}</>;
};

export default Navbar;
