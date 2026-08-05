import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MotionProvider } from "@/components/motion/MotionProvider";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Archive from "@/pages/Archive";
import LoadingScreen from "@/components/LoadingScreen";
import { logPerfEvent } from "@/lib/perf-logger";
import { initWheelTracer } from "@/lib/wheel-tracer";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/archive" component={Archive} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    logPerfEvent("App mounted");
    initWheelTracer();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MotionProvider>
          {/* Brand splash — uses Lenis & scroll lifecycle coordination */}
          <LoadingScreen />
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
        </MotionProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
