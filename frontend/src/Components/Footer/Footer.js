import React from "react";
import { BsHeartFill } from "react-icons/bs";
import "./Footer.css";

const Footer = () => {
    return (
        <footer style={footerStyle}>
            <p>
                Made with{" "}
                <BsHeartFill style={{ color: "red", marginBottom: "-2px" }} />{" "}
                with ReactJS
            </p>
        </footer>
    );
};

const footerStyle = {
    textAlign: "center",
    padding: "1rem",
    background: "#005a7b",
};

export default Footer;
