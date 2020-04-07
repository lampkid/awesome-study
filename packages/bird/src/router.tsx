import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";

import routesConfig from "@/config/routes";

import dynamicWrapper from "@/components/DynamicWrapper";
import loading from "@/components/LoadingComponent";
// routes utils
function formatRoutes(routesConfig: RouteConfig[]) {
  return routesConfig.map((route: RouteConfig, index) => {
    const { component, children, ...others } = route;
    const formattedRoute: RouteConfig = {
      component: loading(dynamicWrapper(component)),
      ...others
    };
    if (Array.isArray(children) && children.length > 0) {
      formattedRoute.children = formatRoutes(children);
    }
    return formattedRoute;
  });
}

export const routes = formatRoutes(routesConfig);

export default function AppRouter() {
  return (
    <Router>
      {routes.map(({ children, ...route }, index) => {
        return [
          <Route key={index} {...route} />,
          children &&
            children.map((croute: {}, cindex: number) => (
              <Route key={cindex} {...croute} />
            ))
        ];
      })}
    </Router>
  );
}
