import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const RouterContext = createContext({ path: '/', navigate: () => {} });

function normalizePath(path) {
  if (!path || path === '/') return '/';
  return path.replace(/\/+$/, '') || '/';
}

function getPath() {
  if (window.location.protocol === 'file:') {
    const hashPath = window.location.hash.replace(/^#/, '').split('#')[0];
    return hashPath.startsWith('/') ? normalizePath(hashPath) : '/';
  }

  return normalizePath(window.location.pathname);
}

function scrollToHash(hash) {
  if (!hash) return;

  window.requestAnimationFrame(() => {
    const target = document.getElementById(hash.replace('#', ''));
    if (!target) return;

    const headerOffset = 150;
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
}

export function RouterProvider({ children }) {
  const [path, setPath] = useState(getPath);

  useEffect(() => {
    const onPopState = () => setPath(getPath());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    scrollToHash(window.location.hash);
  }, [path]);

  const value = useMemo(
    () => ({
      path,
      navigate: (nextPath) => {
        const url = new URL(nextPath, window.location.origin);
        if (window.location.protocol === 'file:') {
          window.location.hash = url.pathname + url.hash;
        } else {
          window.history.pushState({}, '', nextPath);
        }
        setPath(normalizePath(url.pathname));
        scrollToHash(url.hash);
      },
    }),
    [path],
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useLocation() {
  return useContext(RouterContext).path;
}

export function useNavigate() {
  return useContext(RouterContext).navigate;
}

export function Link({ path, className, children, onClick, ...props }) {
  const { navigate } = useContext(RouterContext);

  return (
    <a
      href={path}
      className={className}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        event.preventDefault();
        navigate(path);
      }}
      {...props}
    >
      {children}
    </a>
  );
}
