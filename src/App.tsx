import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MapPage } from "./pages/map";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="h-screen w-screen">
                <MapPage />
            </div>
        </QueryClientProvider>
    );
}

export default App;
