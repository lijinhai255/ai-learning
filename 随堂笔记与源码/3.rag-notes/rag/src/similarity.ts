/** 嵌入向量维度（与所用 embedding 模型保持一致） */
export const EMBEDDING_DIM = 2048;

function assertSameDim(a: number[], b: number[]): void {
  if (a.length !== b.length) {
    throw new Error(`向量维度不一致：${a.length} vs ${b.length}`);
  }
}

/**
 * 余弦相似度：只看向量的方向，忽略长度。
 * 取值 [-1, 1]，越接近 1 越相似；文本嵌入场景下通常落在 [0, 1]。
 * 公式：cos(a, b) = (a · b) / (|a| × |b|)
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  assertSameDim(a, b);

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    const ai = a[i]!;
    const bi = b[i]!;
    dot += ai * bi;
    normA += ai * ai;
    normB += bi * bi;
  }

  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  // 任一向量为零向量时方向无定义，约定返回 0
  return denom === 0 ? 0 : dot / denom;
}

/**
 * 欧式距离（L2 距离）：两个点在空间中的直线距离。
 * 它是「距离」而非「相似度」——越小越相似，取值 [0, +∞)。
 * 公式：d(a, b) = sqrt(Σ (aᵢ - bᵢ)²)
 */
export function euclideanDistance(a: number[], b: number[]): number {
  assertSameDim(a, b);

  let sum = 0;

  for (let i = 0; i < a.length; i++) {
    const diff = a[i]! - b[i]!;
    sum += diff * diff;
  }

  return Math.sqrt(sum);
}

/**
 * 点积（内积）：同时反映方向和长度，越大越相似，取值 (-∞, +∞)。
 * 注意：当两个向量都已归一化（模长为 1）时，点积与余弦相似度完全等价，
 * 这也是向量库用内积作为默认度量时，要求先做归一化的原因。
 * 公式：a · b = Σ aᵢbᵢ
 */
export function dotProduct(a: number[], b: number[]): number {
  assertSameDim(a, b);

  let sum = 0;

  for (let i = 0; i < a.length; i++) {
    sum += a[i]! * b[i]!;
  }

  return sum;
}
