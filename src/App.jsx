import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import BrandLogo from "./components/ui/BrandLogo";

function App() {
  return (
    <BrowserRouter>
      <BrandLogo />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
