export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-5xl mx-auto pt-40 pb-12">
      <p className="text-gray-500 text-xs">&copy; {currentYear} QMarket.</p>
    </footer>
  );
}
