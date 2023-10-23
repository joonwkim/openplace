'use client'

import Link from "next/link"
import { Nav, NavDropdown } from "react-bootstrap"

export default function TextEditLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <Nav>
                <Nav.Link href="/regContents/textEdit/editor">Editor</Nav.Link>
                <Nav.Link href="/regContents/textEdit/extendedEditor">Extended Editor</Nav.Link>
            </Nav>
            <section className='mt-3'>
                {children}
            </section>
        </>

    )
}
