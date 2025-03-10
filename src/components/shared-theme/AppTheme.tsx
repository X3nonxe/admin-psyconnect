import * as React from 'react';
import { createTheme, ThemeOptions, ThemeProvider } from '@mui/material/styles';
import { inputsCustomizations } from './customization/inputs';
import { dataDisplayCustomizations } from './customization/dataDisplay';
import { feedbackCustomizations } from './customization/feedback';
import { navigationCustomizations } from './customization/navigation';
import { surfacesCustomizations } from './customization/surfaces';
import { shadows, shape, typography } from './themePrimitives';

interface AppThemeProps {
  children: React.ReactNode;
  /**
   * This is for the docs site. You can ignore it or remove it.
   */
  disableCustomTheme?: boolean;
  themeComponents?: ThemeOptions['components'];
}

export default function AppTheme(props: AppThemeProps) {
  const { children, disableCustomTheme, themeComponents } = props;
  const theme = React.useMemo(() => {
    return disableCustomTheme
      ? {}
      : createTheme({
          // Removed cssVariables as it does not exist in ThemeOptions
          // colorSchemes, // Recently added in v6 for building light & dark mode app, see https://mui.com/material-ui/customization/palette/#color-schemes
          typography,
          shadows,
          shape,
          components: {
            ...inputsCustomizations,
            ...dataDisplayCustomizations,
            ...feedbackCustomizations,
            ...navigationCustomizations,
            ...surfacesCustomizations,
            ...themeComponents,
          },
        });
  }, [disableCustomTheme, themeComponents]);
  if (disableCustomTheme) {
    return <React.Fragment>{children}</React.Fragment>;
  }
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
}
