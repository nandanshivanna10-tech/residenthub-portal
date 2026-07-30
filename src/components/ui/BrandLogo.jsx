import logo from "../../assets/logo.jpeg";

export default function BrandLogo() {
  return (
    <img
      src={logo}
      alt="Code Morphicx"
      className="fixed top-4 right-4 w-16 h-16 md:w-20 md:h-20 object-contain z-[9999] pointer-events-none"
    />
  );
}
