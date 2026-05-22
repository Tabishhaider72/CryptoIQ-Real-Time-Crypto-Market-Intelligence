'use client';

import * as React from 'react';

type ThemeSelection = 'light' | 'dark' | 'system';
type Resolved = 'light' | 'dark';

type ThemeContextValue = {
  theme: ThemeSelection;
  resolvedTheme: Resolved;
  setTheme: (theme: ThemeSelection) => void;
};

const ThemeContext = React.createContext<
  ThemeContextValue | undefined
>(undefined);

const THEME_STORAGE_KEY = 'theme';

function getSystemTheme(): Resolved {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function applyTheme(theme: ThemeSelection): Resolved {
  const resolved =
    theme === 'system'
      ? getSystemTheme()
      : theme;

  document.documentElement.classList.toggle(
    'dark',
    resolved === 'dark'
  );

  document.documentElement.style.colorScheme =
    resolved;

  return resolved;
}

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setThemeState] =
    React.useState<ThemeSelection>(() => {
      if (typeof window === 'undefined') {
        return 'system';
      }

      try {
        const raw =
          localStorage.getItem(
            THEME_STORAGE_KEY
          );

        if (
          raw === 'light' ||
          raw === 'dark' ||
          raw === 'system'
        ) {
          return raw;
        }
      } catch {}

      return 'system';
    });

  const [resolvedTheme, setResolvedTheme] =
    React.useState<Resolved>('light');

  React.useEffect(() => {
    if (theme === 'system') {
      const resolved =
        applyTheme('system');

      setResolvedTheme(resolved);

      const media = window.matchMedia(
        '(prefers-color-scheme: dark)'
      );

      const listener = () => {
        setResolvedTheme(
          applyTheme('system')
        );
      };

      media.addEventListener(
        'change',
        listener
      );

      return () => {
        media.removeEventListener(
          'change',
          listener
        );
      };
    }

    setResolvedTheme(
      applyTheme(theme)
    );
  }, [theme]);

  const setTheme = React.useCallback(
    (value: ThemeSelection) => {
      setThemeState(value);

      try {
        localStorage.setItem(
          THEME_STORAGE_KEY,
          value
        );
      } catch {}
    },
    []
  );

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context =
    React.useContext(ThemeContext);

  if (!context) {
    throw new Error(
      'useTheme must be used within ThemeProvider'
    );
  }

  return context;
}