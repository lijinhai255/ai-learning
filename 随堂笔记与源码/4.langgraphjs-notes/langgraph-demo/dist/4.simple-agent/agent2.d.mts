import "dotenv/config";
export declare const agent: import("@langchain/langgraph").CompiledStateGraph<{
  topic: string;
  urls: string[];
  contents: string[];
  report: string;
}, {
  topic?: string;
  urls?: string[];
  contents?: string[] | import("@langchain/langgraph").OverwriteValue<string[]>;
  report?: string;
}, "__start__" | "fetchTool" | "modelNode" | "analyze", {
  topic: {
    (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
    (): import("@langchain/langgraph").LastValue<string>;
    Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
  };
  urls: {
    (annotation: import("@langchain/langgraph").SingleReducer<string[], string[]>): import("@langchain/langgraph").BaseChannel<string[], string[] | import("@langchain/langgraph").OverwriteValue<string[]>, unknown>;
    (): import("@langchain/langgraph").LastValue<string[]>;
    Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
  };
  contents: import("@langchain/langgraph").BaseChannel<string[], string[] | import("@langchain/langgraph").OverwriteValue<string[]>, unknown>;
  report: {
    (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
    (): import("@langchain/langgraph").LastValue<string>;
    Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
  };
}, {
  topic: {
    (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
    (): import("@langchain/langgraph").LastValue<string>;
    Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
  };
  urls: {
    (annotation: import("@langchain/langgraph").SingleReducer<string[], string[]>): import("@langchain/langgraph").BaseChannel<string[], string[] | import("@langchain/langgraph").OverwriteValue<string[]>, unknown>;
    (): import("@langchain/langgraph").LastValue<string[]>;
    Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
  };
  contents: import("@langchain/langgraph").BaseChannel<string[], string[] | import("@langchain/langgraph").OverwriteValue<string[]>, unknown>;
  report: {
    (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
    (): import("@langchain/langgraph").LastValue<string>;
    Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
  };
}, import("@langchain/langgraph").StateDefinition, {
  analyze: {
    urls: string[];
  };
  fetchTool: {
    contents: string[];
  };
  modelNode: {
    report: string;
  };
}, unknown, unknown, []>;
//# sourceMappingURL=agent2.d.mts.map