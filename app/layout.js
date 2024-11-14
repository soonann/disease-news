"use client"
// export const metadata = {
//     title: 'Next.js',
//     description: 'Generated by Next.js',
// }
import { usePathname } from 'next/navigation'

// These styles apply to every route in the application
import './globals.css'

export default function RootLayout({
    children,
}) {
    const pathname = usePathname()

    return (
        <html lang="en">
            <body>
                <script type="text/javascript" src=" https://public.tableau.com/javascripts/api/tableau-2.min.js"></script>
                <h1 className="text-2xl p-3 font-bold" > Measles Analysis Dashboard</h1>
                <div className="p-3">
                    <a className={"p-3 underline" + (pathname == "/macro" ? "text-sky-500" : "")} href="/macro">Macro Factors</a>
                    &nbsp;&nbsp;|&nbsp;&nbsp;
                    <a className={"p-3 underline" + (pathname == "/external" ? "text-sky-500" : "")} href="/external">External Factors</a>
                    &nbsp;&nbsp;|&nbsp;&nbsp;
                    <a className={"p-3 underline" + (pathname == "/vaccine" ? "text-sky-500" : "")} href="/vaccine">Vaccine Factors</a>
                    &nbsp;&nbsp;|&nbsp;&nbsp;
                    <a className={"p-3 underline" + (pathname == "/" ? "text-sky-500" : "")} href="/">Real time Dashboard</a>
                </div>
                {children}</body>
        </html >
    )
}
