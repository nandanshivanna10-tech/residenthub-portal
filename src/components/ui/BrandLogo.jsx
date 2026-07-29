import logo from "../../assets/logo.jpeg";

export default function BrandLogo() {
  return (
    <div className="fixed top-4 right-4 z-50">
      <img
        src={logo}
        alt="Code Morphicx"
        className="w-20 h-20 md:w-24 md:h-24 object-contain"
      />
    </div>
  );
}
