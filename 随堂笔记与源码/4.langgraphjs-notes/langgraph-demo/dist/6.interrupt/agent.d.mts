import "dotenv/config";
export declare const agent: import("@langchain/langgraph").CompiledStateGraph<{
  url: string;
  times: number;
  text: string;
  approved: string;
}, {
  url?: string;
  times?: number;
  text?: string;
  approved?: string;
}, "__start__" | "fetchTool" | "modelNode" | "interrutNode", {
  url: {
    (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
    (): import("@langchain/langgraph").LastValue<string>;
    Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
  };
  times: {
    (annotation: import("@langchain/langgraph").SingleReducer<number, number>): import("@langchain/langgraph").BaseChannel<number, number | import("@langchain/langgraph").OverwriteValue<number>, unknown>;
    (): import("@langchain/langgraph").LastValue<number>;
    Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
  };
  text: {
    (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
    (): import("@langchain/langgraph").LastValue<string>;
    Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
  };
  approved: {
    (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
    (): import("@langchain/langgraph").LastValue<string>;
    Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
  };
}, {
  url: {
    (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
    (): import("@langchain/langgraph").LastValue<string>;
    Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
  };
  times: {
    (annotation: import("@langchain/langgraph").SingleReducer<number, number>): import("@langchain/langgraph").BaseChannel<number, number | import("@langchain/langgraph").OverwriteValue<number>, unknown>;
    (): import("@langchain/langgraph").LastValue<number>;
    Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
  };
  text: {
    (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
    (): import("@langchain/langgraph").LastValue<string>;
    Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
  };
  approved: {
    (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
    (): import("@langchain/langgraph").LastValue<string>;
    Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
  };
}, import("@langchain/langgraph").StateDefinition, {
  fetchTool: {
    times: number;
    text: string;
  };
  modelNode: {
    times: number;
  };
  interrutNode: {
    approved: any;
  };
}, unknown, unknown, []>;
//# sourceMappingURL=agent.d.mts.map