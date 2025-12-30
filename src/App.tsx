import { Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Web3Provider } from "@/contexts/Web3Context";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { routeConfig } from "./config/routes";
import { Loader2 } from "lucide-react";

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Configure React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <AuthProvider>
            <Web3Provider>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      {routeConfig.map((route) => {
                        const { path, element: Element, isProtected, allowedRoles } = route;
                        
                        if (isProtected) {
                          return (
                            <Route
                              key={path}
                              path={path}
                              element={
                                <ProtectedRoute allowedUserTypes={allowedRoles}>
                                  <Element />
                                </ProtectedRoute>
                              }
                            />
                          );
                        }
                        
                        return (
                          <Route
                            key={path}
                            path={path}
                            element={<Element />}
                          />
                        );
                      })}
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
              </div>
            </Web3Provider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
