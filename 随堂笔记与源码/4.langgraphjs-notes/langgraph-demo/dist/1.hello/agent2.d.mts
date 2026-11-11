import "dotenv/config";
import z from "zod";
export declare const toolsByName: {
  add: import("langchain").DynamicStructuredTool<z.ZodObject<{
    a: z.ZodNumber;
    b: z.ZodNumber;
  }, z.core.$strip>, {
    a: number;
    b: number;
  }, {
    a: number;
    b: number;
  }, number, unknown, "add">;
  subtract: import("langchain").DynamicStructuredTool<z.ZodObject<{
    a: z.ZodNumber;
    b: z.ZodNumber;
  }, z.core.$strip>, {
    a: number;
    b: number;
  }, {
    a: number;
    b: number;
  }, number, unknown, "subtract">;
  multiply: import("langchain").DynamicStructuredTool<z.ZodObject<{
    a: z.ZodNumber;
    b: z.ZodNumber;
  }, z.core.$strip>, {
    a: number;
    b: number;
  }, {
    a: number;
    b: number;
  }, number, unknown, "multiply">;
  divide: import("langchain").DynamicStructuredTool<z.ZodObject<{
    a: z.ZodNumber;
    b: z.ZodNumber;
  }, z.core.$strip>, {
    a: number;
    b: number;
  }, {
    a: number;
    b: number;
  }, number, unknown, "divide">;
};
export declare const tools: (import("langchain").DynamicStructuredTool<z.ZodObject<{
  a: z.ZodNumber;
  b: z.ZodNumber;
}, z.core.$strip>, {
  a: number;
  b: number;
}, {
  a: number;
  b: number;
}, number, unknown, "add"> | import("langchain").DynamicStructuredTool<z.ZodObject<{
  a: z.ZodNumber;
  b: z.ZodNumber;
}, z.core.$strip>, {
  a: number;
  b: number;
}, {
  a: number;
  b: number;
}, number, unknown, "subtract"> | import("langchain").DynamicStructuredTool<z.ZodObject<{
  a: z.ZodNumber;
  b: z.ZodNumber;
}, z.core.$strip>, {
  a: number;
  b: number;
}, {
  a: number;
  b: number;
}, number, unknown, "multiply"> | import("langchain").DynamicStructuredTool<z.ZodObject<{
  a: z.ZodNumber;
  b: z.ZodNumber;
}, z.core.$strip>, {
  a: number;
  b: number;
}, {
  a: number;
  b: number;
}, number, unknown, "divide">)[];
//# sourceMappingURL=agent2.d.mts.map