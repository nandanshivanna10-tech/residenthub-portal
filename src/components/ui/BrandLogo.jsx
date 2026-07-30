import logo from "../../assets/logo.jpeg";

export default function BrandLogo() {
  return (
    <img
      src={logo}
      alt="Code Morphicx"
      className="hidden lg:block fixed top-3 right-3 w-24 h-24 object-contain z-[9999] pointer-events-none"
    />
  );
}
