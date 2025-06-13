import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary caught:', error, errorInfo);
    this.setState({ error, errorInfo });

    // Handle error autentikasi khusus
    if (error.message.includes('401') || error.message.includes('403')) {
      logout();
      window.location.href = '/login';
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <h2>Oops! Terjadi Kesalahan</h2>
            <p className="error-message">{this.state.error?.message || 'Maaf, terjadi kesalahan yang tidak terduga.'}</p>

            <div className="error-actions">
              <button className="retry-button" onClick={this.handleReload}>
                Muat Ulang Halaman
              </button>
              {this.state.error?.message.includes('401') && <button onClick={this.handleLogout}>Kembali ke Login</button>}
            </div>

            <details className="error-details">
              <summary>Detail Teknis</summary>
              <pre>{this.state.error?.stack}</pre>
              <pre>{this.state.errorInfo?.componentStack}</pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
