import { BrowserRouter } from "react-router";
import AppRouter from "./AppRouter";
import { AuthChecker } from "./AuthChecker";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Modals from "./Modals/Modals";
import { Toaster } from "react-hot-toast";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthChecker>
          <AppRouter />
          <Modals />
        </AuthChecker>
        <Toaster containerClassName="font-extrabold" />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
