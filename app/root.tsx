import {
  Links,

  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import type { LinksFunction } from "@remix-run/node";

import "./app.scss";
import "./scss/styles.scss";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        
        <link type="text/css" href="https://wow.zamimg.com/css/universal.css?19" rel="stylesheet"></link>
        <script src="https://wow.zamimg.com/js/tooltips.js"></script>
      </head>
      <body>
        <header className="header">
          <h1>Casualties guild</h1>
        </header>

        <div className="container py-4 px-3 mx-auto">
          
          
          {children}
          <ScrollRestoration />
          <Scripts />
          
        <script>const whTooltips = {};
          whTooltips.colorLinks = true;
          whTooltips.iconizeLinks = true;
          whTooltip.renameLinks =  true;
        </script>
        
        </div>
        
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
