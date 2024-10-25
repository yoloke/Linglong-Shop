import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import viteCompression from "vite-plugin-compression"; // 生成.gz文件
import { visualizer } from "rollup-plugin-visualizer"; // 分析生成包的大小
import path from "path"; //这个path用到了上面安装的@types/node

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [
      vue(),
      AutoImport({
        //自动导入第三方库或组件 不需要手动编写import {xxx} from vue
        // dts: true, // 如果使用 Typescript，需要设置 dts 为 true 插件会在项目根目录生成类型文件 auto-imports.d.ts ，确保该文件在 tsconfig 中被 include
        dts: "types/auto-imports.d.ts",
        dirs: ["src/composables"], //文件夹。看情况加
        imports: [
          "vue",
          "vue-router",
          "pinia"
          // 其他需要自动导入的库
        ],
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        dts: "types/components.d.ts", // 输出文件，里面都是一些import的组件键值对
        dirs: ["src/components"], //让src/components里的组件不用再手动引入
        // 配置需要自动注册的组件
        resolvers: [ElementPlusResolver()]
      }),
      {
        ...viteCompression(),
        apply: "build"
      },
      visualizer({
        open: true, // 在构建后自动打开报告
        filename: "bundle-stats.html", // 生成的报告文件名
        title: "Bundle Visualizer" // 报告的标题
      }),
      // 使用 svg 图标
      createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
        // Specify symbolId format
        symbolId: "icon-[dir]-[name]"
      })
    ],
    resolve: {
      alias: {
        "@": path.resolve("./src") // @代替src
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/styles/variable.scss";'
        }
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ["vue", "pinia", "vue-router"]
            // elementIcons: ['@element-plus/icons-vue']
          },
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]"
        }
      }
    },
    server: {
      proxy: {
        "/api": {
          target: "https://storeapi.linyaps.org.cn", // 目标服务器
          changeOrigin: true, // 是否改变请求源
          rewrite: path => path.replace(/^\/api/, "") // 重写路径
        }
      }
    }
  };
});
