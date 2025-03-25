// // src/components/ErrorBoundary.tsx
// import React, { Component, ReactNode } from "react";

// interface ErrorBoundaryProps {
//   children: ReactNode;
//   fallback?: ReactNode;
// }

// interface ErrorBoundaryState {
//   hasError: boolean;
// }

// export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
//   state: ErrorBoundaryState = { hasError: false };

//   static getDerivedStateFromError(error: Error): ErrorBoundaryState {
//     console.error("Error caught in ErrorBoundary:", error);
//     return { hasError: true };
//   }

//   componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
//     console.error("ErrorBoundary caught error:", error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return this.props.fallback || <h1>Something went wrong. Please try again later.</h1>;
//     }
//     return this.props.children;
//   }
// }