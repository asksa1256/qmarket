export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full md:w-5xl mx-auto pt-20 md:pt-40 pb-12 px-4 md:px-0 text-center md:text-left">
      <p className="text-gray-500 text-xs">&copy; {currentYear} QMarket.</p>
    </footer>
  );
}
