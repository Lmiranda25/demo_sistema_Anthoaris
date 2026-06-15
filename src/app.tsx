import { HashRouter } from "react-router-dom";
import { Providers } from "@/app/providers";
import { AppRouter } from "@/app/router";

/**
 * Raíz de la aplicación. Se usa HashRouter para que una recarga en GitHub Pages
 * no solicite al servidor una ruta que no conoce (SSD 14.3).
 */
export function App() {
  return (
    <HashRouter>
      <Providers>
        <AppRouter />
      </Providers>
    </HashRouter>
  );
}
