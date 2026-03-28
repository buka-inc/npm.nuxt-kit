/**
 * 将 Uint8Array 编码为 base64url 字符串（RFC 4648 §5，无填充）
 */
function base64UrlEncode(buffer: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...buffer))
  return base64.replace(/\+/g, '-').replace(/\//g, '_')
    .replace(/=/g, '')
}

/**
 * PKCE（Proof Key for Code Exchange，RFC 7636）工具类
 */
export class Pkce {
  /**
   * 生成 PKCE 参数对
   *
   * @returns `[codeVerifier, codeChallenge]` 元组
   *   - `codeVerifier`：本地保存，在 token 换取时发送
   *   - `codeChallenge`：注册授权请求时发送（S256 方式）
   */
  static async generate(): Promise<[codeVerifier: string, codeChallenge: string]> {
    // 生成 32 字节随机数作为 code_verifier（base64url 后长度为 43）
    const randomBytes = new Uint8Array(32)
    globalThis.crypto.getRandomValues(randomBytes)
    const codeVerifier = base64UrlEncode(randomBytes)

    // 对 code_verifier 做 SHA-256 哈希得到 code_challenge
    const encoder = new TextEncoder()
    const digest = await globalThis.crypto.subtle.digest('SHA-256', encoder.encode(codeVerifier))
    const codeChallenge = base64UrlEncode(new Uint8Array(digest))

    return [codeVerifier, codeChallenge]
  }
}
