import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  transpilePackages: ["@erp/miniapp-ui"],
  outputFileTracingRoot: root,
};

export default nextConfig;
