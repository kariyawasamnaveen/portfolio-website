'use client';

import React from 'react';

interface Props {
    children: React.ReactNode;
}
interface State {
    hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: any) {
        console.error('Feature crashed:', error);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 rounded bg-red-900/50 text-red-200 text-sm border border-red-800 m-4">
                    Experimental feature encountered an error.
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        className="ml-4 underline hover:text-white"
                    >
                        Retry
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}
