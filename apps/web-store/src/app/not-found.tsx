import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center bg-[#FAF7F2]">
      <div className="w-14 h-14 rounded-2xl bg-white text-[#B5532E] flex items-center justify-center text-xl font-bold mb-4 border border-[#EAE3D9] shadow-xs">
        <i className="fas fa-compass"></i>
      </div>
      <h1 className="apple-heading text-3xl font-bold text-[#1D1917] mb-2 tracking-tight">Page Not Found</h1>
      <p className="apple-subhead text-sm text-[#78716C] max-w-md mb-6 font-normal">
        The item or page you are looking for may have moved or is temporarily unavailable.
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 rounded-xl bg-[#B5532E] hover:bg-[#A04523] text-white text-xs font-semibold transition-colors shadow-xs no-underline apple-pressable"
      >
        Return to Homepage
      </Link>
    </div>
  );
}
