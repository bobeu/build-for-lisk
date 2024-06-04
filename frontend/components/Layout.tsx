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
                <Container maxWidth="lg" className="mx-auto my-6 h-full">
                    {children}
                </Container>
                <Footer />
            </Box>
        </React.Fragment>
    );
};

export default Layout;
