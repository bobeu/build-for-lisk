import React, { FC, ReactNode } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

interface LayoutProps {
    children: ReactNode;

}
const Layout: FC<LayoutProps> = ({ children }) => {
    return (
        <React.Fragment>
            <Box className="w-full flex flex-col justify-center item-center h-screen bg-black text-white">
                <Header />
                <Box className="mx-auto py-4 h-full">
                    {children}
                </Box>
                <Footer />
            </Box>
        </React.Fragment>
    );
};

export default Layout;
