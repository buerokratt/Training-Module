// vite.config.ts
import { defineConfig, loadEnv } from "file:///app/node_modules/vite/dist/node/index.js";
import react from "file:///app/node_modules/@vitejs/plugin-react/dist/index.mjs";
import tsconfigPaths from "file:///app/node_modules/vite-tsconfig-paths/dist/index.mjs";
import svgr from "file:///app/node_modules/vite-plugin-svgr/dist/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "/app";
var vite_config_default = ({ mode }) => {
  process.env = Object.assign(process.env, loadEnv(mode, process.cwd(), ""));
  return defineConfig({
    envPrefix: "REACT_APP_",
    plugins: [
      react(),
      tsconfigPaths(),
      svgr()
    ],
    base: "/training",
    //Change this according to your reverse proxy subpath
    optimizeDeps: {
      include: ["howler"]
    },
    define: {
      "process.env": process.env
    },
    server: {
      headers: {
        ...process.env.REACT_APP_CSP && {
          "Content-Security-Policy": process.env.REACT_APP_CSP
        }
      }
    },
    build: {
      outDir: "./build",
      target: "es2015",
      emptyOutDir: true
    },
    resolve: {
      alias: {
        "~@fontsource": path.resolve(__vite_injected_original_dirname, "node_modules/@fontsource"),
        "@": `${path.resolve(__vite_injected_original_dirname, "./src")}`
      }
    }
  });
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvYXBwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvYXBwL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9hcHAvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tICd2aXRlLXRzY29uZmlnLXBhdGhzJztcbmltcG9ydCBzdmdyIGZyb20gJ3ZpdGUtcGx1Z2luLXN2Z3InO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCAoeyBtb2RlIH0pID0+IHtcbiAgcHJvY2Vzcy5lbnYgPSBPYmplY3QuYXNzaWduKHByb2Nlc3MuZW52LCBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCksICcnKSk7XG5cbiAgcmV0dXJuIGRlZmluZUNvbmZpZyh7XG4gICAgZW52UHJlZml4OiAnUkVBQ1RfQVBQXycsXG4gICAgcGx1Z2luczogW1xuICAgICAgcmVhY3QoKSxcbiAgICAgIHRzY29uZmlnUGF0aHMoKSxcbiAgICAgIHN2Z3IoKSxcbiAgICBdLFxuICAgIGJhc2U6ICcvdHJhaW5pbmcnLCAvL0NoYW5nZSB0aGlzIGFjY29yZGluZyB0byB5b3VyIHJldmVyc2UgcHJveHkgc3VicGF0aFxuICAgIG9wdGltaXplRGVwczoge1xuICAgICAgaW5jbHVkZTogWydob3dsZXInXSxcbiAgICB9LFxuICAgIGRlZmluZToge1xuICAgICAgJ3Byb2Nlc3MuZW52JzogcHJvY2Vzcy5lbnYsXG4gICAgfSxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgLi4uKHByb2Nlc3MuZW52LlJFQUNUX0FQUF9DU1AgJiYge1xuICAgICAgICAgICdDb250ZW50LVNlY3VyaXR5LVBvbGljeSc6IHByb2Nlc3MuZW52LlJFQUNUX0FQUF9DU1AsXG4gICAgICAgIH0pLFxuICAgICAgfSxcbiAgICB9LFxuICAgIGJ1aWxkOiB7XG4gICAgICBvdXREaXI6ICcuL2J1aWxkJyxcbiAgICAgIHRhcmdldDogJ2VzMjAxNScsXG4gICAgICBlbXB0eU91dERpcjogdHJ1ZSxcbiAgICB9LFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgICd+QGZvbnRzb3VyY2UnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnbm9kZV9tb2R1bGVzL0Bmb250c291cmNlJyksXG4gICAgICAgICdAJzogYCR7cGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyl9YCxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG59O1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE4TCxTQUFTLGNBQWMsZUFBZTtBQUNwTyxPQUFPLFdBQVc7QUFDbEIsT0FBTyxtQkFBbUI7QUFDMUIsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sVUFBVTtBQUpqQixJQUFNLG1DQUFtQztBQU96QyxJQUFPLHNCQUFRLENBQUMsRUFBRSxLQUFLLE1BQU07QUFDM0IsVUFBUSxNQUFNLE9BQU8sT0FBTyxRQUFRLEtBQUssUUFBUSxNQUFNLFFBQVEsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUV6RSxTQUFPLGFBQWE7QUFBQSxJQUNsQixXQUFXO0FBQUEsSUFDWCxTQUFTO0FBQUEsTUFDUCxNQUFNO0FBQUEsTUFDTixjQUFjO0FBQUEsTUFDZCxLQUFLO0FBQUEsSUFDUDtBQUFBLElBQ0EsTUFBTTtBQUFBO0FBQUEsSUFDTixjQUFjO0FBQUEsTUFDWixTQUFTLENBQUMsUUFBUTtBQUFBLElBQ3BCO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTixlQUFlLFFBQVE7QUFBQSxJQUN6QjtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sU0FBUztBQUFBLFFBQ1AsR0FBSSxRQUFRLElBQUksaUJBQWlCO0FBQUEsVUFDL0IsMkJBQTJCLFFBQVEsSUFBSTtBQUFBLFFBQ3pDO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxNQUNSLFFBQVE7QUFBQSxNQUNSLGFBQWE7QUFBQSxJQUNmO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxnQkFBZ0IsS0FBSyxRQUFRLGtDQUFXLDBCQUEwQjtBQUFBLFFBQ2xFLEtBQUssR0FBRyxLQUFLLFFBQVEsa0NBQVcsT0FBTyxDQUFDO0FBQUEsTUFDMUM7QUFBQSxJQUNGO0FBQUEsRUFDRixDQUFDO0FBQ0g7IiwKICAibmFtZXMiOiBbXQp9Cg==
