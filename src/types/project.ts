/**
 * @description：项目状态
 */
export enum ProjectState {
  UnFinish = 0, // 进行中的项目
  Finish = 1 // 已完成的项目
}
/**
 * 描述一个项目的基本信息。
 * @interface Project
 * @property {number} id - 项目唯一标识符。
 * @property {string} name - 项目名称。
 * @property {number} amount - 项目预算或金额，通常为数值类型。
 * @property {ProjectState} state - 项目状态。
 * @property {string} createTime - 项目创建时间。
 * @property {string} title - 项目需求标题。
 * @property {string} content - 项目需求内容。
 * @property {File[]} file - 与项目相关的文件数组。
 */
export default interface ProjectInter {
  id: number;
  name: string;
  amount: number;
  state: ProjectState;
  createTime: string;
  title: string;
  content: string;
  flies: boolean;
  file: File[];
}
/**
 * 获取项目状态的文本描述
 * @param {ProjectState} state - 项目的状态
 * @returns {string} 项目状态的文本描述
 */
export function getStatusText(state: ProjectState): string {
  switch (state) {
    case ProjectState.UnFinish:
      return "进行中";
    case ProjectState.Finish:
      return "已完成";
    default:
      return "未知状态";
  }
}

/**
 * 获取项目状态对应的标签类型
 * @param {ProjectState} state - 项目的状态
 * @returns {string} 标签类型
 */
export function getTagType(state: ProjectState): string {
  switch (state) {
    case ProjectState.UnFinish:
      return ""; // Or another appropriate type
    case ProjectState.Finish:
      return "success";
    default:
      return "default";
  }
}
