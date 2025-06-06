// translate.ts
import axios from "axios"

/**
 * Traduce un texto al idioma destino usando el endpoint no oficial de Google Translate.
 * @param text Texto a traducir
 * @param targetLang Código del idioma destino (por defecto, "es")
 * @returns Texto traducido
 */
export const translateText = async (text: string, targetLang = "es"): Promise<string> => {
  const url = "https://clients5.google.com/translate_a/t"
  const params = new URLSearchParams({
    client: "dict-chrome-ex",
    sl: "auto",
    tl: targetLang,
    q: text,
  })

  const res = await axios.get(url + "?" + params.toString(), {
    headers: { "User-Agent": "Mozilla/5.0" },
    responseType: "json",
  })

  const trans = (res.data.sentences ?? [])
    .map((s: any) => s.trans)
    .join("")
    .trim()

  if (!trans) throw new Error("No se pudo traducir el texto")

  return trans
}
