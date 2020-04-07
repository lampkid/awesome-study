interface RouteConfig {
  name: string;
  title: string;
  path: string;
  exact?: boolean;
  component: any;
  children?: RouteConfig[];
}
