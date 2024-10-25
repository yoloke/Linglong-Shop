// 声明window上自定义属性，如事件总线
// 这段代码的作用是告诉TypeScript，window对象上有一个名为eventBus的属性，并且它的类型是any。
// 这样可以避免在代码中使用window.eventBus时出现类型错误。
declare interface Window {
  eventBus: any;
}

// 声明.vue文件
declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<object, object, any>;
  export default component;
}
