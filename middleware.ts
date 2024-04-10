import {NextRequest, NextResponse} from "next/server";

export default function middleware(request: NextRequest) {
    const token = request.cookies.get("access_token");
    const noAuthPaths = ["/", "/login", "/register"];

    if (!token) {
        if (noAuthPaths.includes(request.nextUrl.pathname)) {
            return NextResponse.next();
        }

        const homeUrl = new URL("/", request.url);
        return NextResponse.redirect(homeUrl);
    }

    if (
        request.nextUrl.pathname === "/" ||
        request.nextUrl.pathname === "/login" ||
        request.nextUrl.pathname === "/register"
    ) {
        const dashboardUrl = new URL("/dashboard", request.url);
        return NextResponse.redirect(dashboardUrl);
    }
}

export const config = {
    matcher: ["/", "/login", "/register", "/dashboard"],
};
