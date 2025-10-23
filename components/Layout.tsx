import React from "react";
import Head from "next/head";
import Link from "next/link";

type Props = {
  children: React.ReactNode;
  title?: string;
  description?: string;
};

export default function Layout({ children, title = "PhishGuard Project", description = "" }: Props) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>
      <header style={{ padding: 16, borderBottom: "1px solid #eee" }}>
        <nav>
          <Link href="/">Home</Link> | <Link href="/services">Services</Link> | <Link href="/trainings">Trainings</Link> | <Link href="/jobs">Jobs</Link> | <Link href="/blog">Blog</Link> | <Link href="/team">Team</Link>
        </nav>
      </header>
      <main style={{ maxWidth: 960, margin: "40px auto", padding: "0 16px" }}>{children}</main>
      <footer style={{ padding: 20, textAlign: "center", borderTop: "1px solid #eee" }}>
        © {new Date().getFullYear()} PhishGuard Project
      </footer>
    </>
  );
}