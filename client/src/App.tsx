import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import LoginPage from "./pages/LoginPage";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";
import ProcessPage from "./pages/ProcessPage";
import OpportunitiesPage from "./pages/OpportunitiesPage";
import ReportPage from "./pages/ReportPage";
import ConnectorsPage from "./pages/ConnectorsPage";
import SettingsPage from "./pages/SettingsPage";
import AppLayout from "./components/AppLayout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LoginPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/onboarding" component={OnboardingPage} />
      <Route path="/dashboard">
        {() => (
          <AppLayout>
            <DashboardPage />
          </AppLayout>
        )}
      </Route>
      <Route path="/process">
        {() => (
          <AppLayout>
            <ProcessPage />
          </AppLayout>
        )}
      </Route>
      <Route path="/opportunities">
        {() => (
          <AppLayout>
            <OpportunitiesPage />
          </AppLayout>
        )}
      </Route>
      <Route path="/report">
        {() => (
          <AppLayout>
            <ReportPage />
          </AppLayout>
        )}
      </Route>
      <Route path="/connectors">
        {() => (
          <AppLayout>
            <ConnectorsPage />
          </AppLayout>
        )}
      </Route>
      <Route path="/settings">
        {() => (
          <AppLayout>
            <SettingsPage />
          </AppLayout>
        )}
      </Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
