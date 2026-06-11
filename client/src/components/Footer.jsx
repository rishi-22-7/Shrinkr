function Footer() {
  return (
    <footer className="absolute bottom-6 text-[#2C221E]/60 text-xs font-semibold z-10 select-none">
      © {new Date().getFullYear()} Shrinkr. All rights reserved.
    </footer>
  );
}

export default Footer;
