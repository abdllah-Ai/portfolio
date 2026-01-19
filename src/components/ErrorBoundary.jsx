import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info);
  }
  handleReset = () => {
    this.setState({ hasError: false });
    if (typeof this.props.onReset === 'function') this.props.onReset();
  };
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="card p-4 text-sm text-muted">
          <div>Something went wrong.</div>
          <button onClick={this.handleReset} className="mt-2 btn-ghost-sm">Try again</button>
        </div>
      );
    }
    return this.props.children;
  }
}
