function Footer() {
  return (
    <footer className="bg-white shadow-md p-4 fixed bottom-0 w-full">
      <div className="container mx-auto">
        <p className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} SofiRuiz. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;