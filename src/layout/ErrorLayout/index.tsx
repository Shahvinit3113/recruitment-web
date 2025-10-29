import React, { type ReactElement } from "react";
import {
  AlertTriangle,
  Home,
  RefreshCw,
  ArrowLeft,
  Wifi,
  Server,
  Lock,
  Search,
} from "lucide-react";

// Base interface for common navigation props
interface BaseErrorProps {
  onNavigateHome?: () => void;
  onGoBack?: () => void;
  onRetry?: () => void;
}

// Specific interfaces for different error types
interface NotFoundProps extends BaseErrorProps {}

interface ServerErrorProps extends BaseErrorProps {}

interface ForbiddenProps extends BaseErrorProps {
  onLogin?: () => void;
}

interface NetworkErrorProps extends BaseErrorProps {}

interface GenericErrorProps extends BaseErrorProps {
  errorCode?: string | number;
  title?: string;
  message?: string;
  showRefresh?: boolean;
}

// Error type for the demo component
type ErrorType = "404" | "500" | "403" | "network" | "generic";

interface ErrorTypeOption {
  key: ErrorType;
  label: string;
}

// 404 - Not Found Page
export const NotFound: React.FC<NotFoundProps> = ({
  onNavigateHome,
  onGoBack,
}) => {
  const handleNavigateHome = (): void => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.location.href = "/";
    }
  };

  const handleGoBack = (): void => {
    if (onGoBack) {
      onGoBack();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-6xl font-bold text-indigo-600 mb-4">404</div>
          <Search className="mx-auto h-16 w-16 text-indigo-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Page Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleNavigateHome}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Home className="h-4 w-4" />
            Go Home
          </button>

          <button
            onClick={handleGoBack}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

// 500 - Server Error Page
export const ServerError: React.FC<ServerErrorProps> = ({
  onNavigateHome,
  onRetry,
}) => {
  const handleRefresh = (): void => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleNavigateHome = (): void => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-6xl font-bold text-red-600 mb-4">500</div>
          <Server className="mx-auto h-16 w-16 text-red-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Server Error
          </h1>
          <p className="text-gray-600 mb-8">
            Something went wrong on our end. Please try again later.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleRefresh}
            className="w-full flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>

          <button
            onClick={handleNavigateHome}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Home className="h-4 w-4" />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

// 403 - Forbidden Access Page
export const Forbidden: React.FC<ForbiddenProps> = ({
  onNavigateHome,
  onLogin,
}) => {
  const handleLogin = (): void => {
    if (onLogin) {
      onLogin();
    } else {
      window.location.href = "/login";
    }
  };

  const handleNavigateHome = (): void => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-6xl font-bold text-amber-600 mb-4">403</div>
          <Lock className="mx-auto h-16 w-16 text-amber-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Forbidden
          </h1>
          <p className="text-gray-600 mb-8">
            You don't have permission to access this resource.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
          >
            <Lock className="h-4 w-4" />
            Login
          </button>

          <button
            onClick={handleNavigateHome}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Home className="h-4 w-4" />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

// Network Error Page
export const NetworkError: React.FC<NetworkErrorProps> = ({
  onNavigateHome,
  onRetry,
}) => {
  const handleRetry = (): void => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleNavigateHome = (): void => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <Wifi className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Connection Lost
          </h1>
          <p className="text-gray-600 mb-8">
            Please check your internet connection and try again.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleRetry}
            className="w-full flex items-center justify-center gap-2 bg-slate-600 text-white px-6 py-3 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Retry Connection
          </button>

          <button
            onClick={handleNavigateHome}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Home className="h-4 w-4" />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

// Generic Error Page Component
export const GenericError: React.FC<GenericErrorProps> = ({
  errorCode = "Error",
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  showRefresh = true,
  onNavigateHome,
  onGoBack,
  onRetry,
}) => {
  const handleRefresh = (): void => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleNavigateHome = (): void => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.location.href = "/";
    }
  };

  const handleGoBack = (): void => {
    if (onGoBack) {
      onGoBack();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-6xl font-bold text-purple-600 mb-4">
            {errorCode}
          </div>
          <AlertTriangle className="mx-auto h-16 w-16 text-purple-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600 mb-8">{message}</p>
        </div>

        <div className="space-y-4">
          {showRefresh && (
            <button
              onClick={handleRefresh}
              className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          )}

          <button
            onClick={handleNavigateHome}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Home className="h-4 w-4" />
            Go Home
          </button>

          <button
            onClick={handleGoBack}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

// Demo component to show all error pages
export const ErrorDemo: React.FC = () => {
  const [currentError, setCurrentError] = React.useState<ErrorType>("404");

  const handleNavigateHome = (): void => {
    console.log("Navigate to home");
    // In your app, use: navigate('/') or window.location.href = '/'
  };

  const handleGoBack = (): void => {
    console.log("Go back");
    // In your app, use: navigate(-1) or window.history.back()
  };

  const handleRetry = (): void => {
    console.log("Retry action");
    // In your app, implement retry logic
  };

  const handleLogin = (): void => {
    console.log("Navigate to login");
    // In your app, use: navigate('/login') or window.location.href = '/login'
  };

  const renderError = (): ReactElement => {
    const commonProps: BaseErrorProps = {
      onNavigateHome: handleNavigateHome,
      onGoBack: handleGoBack,
      onRetry: handleRetry,
    };

    switch (currentError) {
      case "404":
        return <NotFound {...commonProps} />;
      case "500":
        return <ServerError {...commonProps} />;
      case "403":
        return <Forbidden {...commonProps} onLogin={handleLogin} />;
      case "network":
        return <NetworkError {...commonProps} />;
      case "generic":
        return <GenericError {...commonProps} />;
      default:
        return <NotFound {...commonProps} />;
    }
  };

  return (
    <div className="relative">
      {/* Current Error Page */}
      {renderError()}
    </div>
  );
};

export default ErrorDemo;

// Export all interfaces for external use
export type {
  BaseErrorProps,
  NotFoundProps,
  ServerErrorProps,
  ForbiddenProps,
  NetworkErrorProps,
  GenericErrorProps,
  ErrorType,
  ErrorTypeOption,
};
