import type {Metadata} from "next";
import "./globals.css";
import {nunitoSans} from "@/app/fonts";
import {ReactQueryProvider} from "@/app/ReactQueryProvider";
import {Slide, ToastContainer} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
    title: "Planilha de gastos",
    description: "Planilha de gastos",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ReactQueryProvider>
            <html lang="en">
            <body className={nunitoSans.className}>
            {children}
            <ToastContainer
                position="top-right"
                autoClose={1500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                theme="light"
                transition={Slide}
            />
            </body>
            </html>
        </ReactQueryProvider>
    );
}
