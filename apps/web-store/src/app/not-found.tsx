import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#F6EDE0] text-[#B5532E] flex items-center justify-center text-2xl font-bold mb-4 shadow-sm">
        <i className="fas fa-compass"></i>
      </div>
      <h1 className="text-3xl font-black font-display text-[#2A2320] mb-2">Page Not Found</h1>
      <p className="text-sm text-[#8C8279] max-w-md mb-6">
        The item or page you are looking for may have moved or is temporarily unavailable.
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 rounded-xl bg-[#B5532E] hover:bg-[#8F3B1F] text-white text-xs font-bold transition-colors shadow-sm"
      >
        Return to Homepage
      </Link>
    </div>
  );
}
