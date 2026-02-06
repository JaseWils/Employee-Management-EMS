import { lazy, Suspense } from 'react';

// Loading component
export const PageLoader = () => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
        <div style={{
            textAlign: 'center',
            color: 'white'
        }}>
            <div style={{
                width: '60px',
                height: '60px',
                border: '6px solid rgba(255, 255, 255, 0.2)',
                borderTop: '6px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 20px'
            }}></div>
            <p>Loading...</p>
        </div>
    </div>
);

// Lazy load wrapper with error boundary
export const lazyLoadComponent = (importFunc) => {
    const LazyComponent = lazy(importFunc);
    
    return (props) => (
        <Suspense fallback={<PageLoader />}>
            <LazyComponent {...props} />
        </Suspense>
    );
};