export interface Greeting {
  name: string
}

export function greet(name: string): string {
  return `Hello, ${name}!`
}
