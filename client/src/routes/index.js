// // Importing the require.context API from Webpack to load routes dynamically
// const routesContext = require.context('../pages', true, /routes\.js$/);

// // Iterating through all matched route files and aggregating their exports
// const allRoutes = routesContext.keys().reduce((routes, file) => {
//   const moduleRoutes = routesContext(file).default;
//   return routes.concat(moduleRoutes);
// }, []);

// // Export all aggregated routes for use in the App component
// export default allRoutes;

// src/routes/index.js

// Dynamically load all `routes.js` files from the `pages` directory using Vite's import.meta.glob
const routeModules = import.meta.glob('../pages/**/routes.jsx', { eager: true });
console.log(routeModules)
// Flatten all routes from each imported module into a single array
const allRoutes = Object.values(routeModules).flatMap((mod) => mod.default);

export default allRoutes;
