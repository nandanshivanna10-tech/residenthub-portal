import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import BrandLogo from "./components/ui/BrandLogo";

function App() {
  return (
    <BrowserRouter>
      <div className="pr-0 lg:pr-28">
        <AppRoutes />
      </div>
      <BrandLogo />
    </BrowserRouter>
  );
}

export default App;
