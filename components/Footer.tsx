export default function Footer() {
  return (
    <footer className="bg-white shadow-md">
      <div className="mx-auto max-w-screen-xl px-4 py-6">
        <p className="text-center text-gray-600">
          &copy; {new Date().getFullYear()} PhishGuard. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
