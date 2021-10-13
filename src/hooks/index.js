import React from 'react';
import PropTypes from 'prop-types';

import { LocaleProvider } from './locale';
import { ProductProvider } from './products';
import { MenuProvider } from './menu';
import { SidebarProvider } from './sidebar';

// Wrapping the application with all Contexts
const AppProvider = ({ children }) => (
  <LocaleProvider>
	<ProductProvider>
		<SidebarProvider>
			<MenuProvider>{children}</MenuProvider>
		</SidebarProvider>
	</ProductProvider>
  </LocaleProvider>
);

AppProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default AppProvider;