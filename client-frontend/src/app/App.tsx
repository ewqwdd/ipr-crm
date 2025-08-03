import { BrowserRouter } from "react-router";
import AppRouter from "./AppRouter";
import { AuthChecker } from "./AuthChecker";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Modals from "./Modals/Modals";
import { Toaster } from "react-hot-toast";
import { useIsMobile } from "@/shared/hooks/useScreenWidth";
import NavbarDesktop from "./AppLayout/Nav/Navbar.desktop";
import NavbarMobile from "./AppLayout/Nav/Navbar.mobile";
import Sidebar from "./AppLayout/Sidebaar/Sidebar";

function App() {
  const queryClient = new QueryClient();
  const isMobile = useIsMobile();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthChecker>
          <div className="flex flex-col gap-7 layout max-lg:pb-28">
            {!isMobile ? <NavbarDesktop /> : <NavbarMobile />}
            <div className="flex gap-10 items-start flex-1">
              {!isMobile && <Sidebar />}
              <AppRouter />
            </div>
          </div>
          <Modals />
        </AuthChecker>
        <Toaster containerClassName="font-extrabold" />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
