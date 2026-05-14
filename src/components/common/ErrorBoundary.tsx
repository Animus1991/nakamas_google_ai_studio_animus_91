import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public declare props: Props;
  public state: State = { hasError: false };


  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
          return <>{this.props.fallback}</>;
      }
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
          <h2 className="text-red-800 font-bold mb-2">Something went wrong</h2>
          <p className="text-[18px] text-red-600">
             {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
