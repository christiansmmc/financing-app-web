"use client";

import {QueryClient, QueryClientProvider} from "react-query";
import React from "react";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

export const ReactQueryProvider = ({
                                       children,
                                   }: {
    children: React.ReactNode;
}) => {
    return (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};
