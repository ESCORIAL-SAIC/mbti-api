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
  const encodedText = encodeURIComponent(text)

  const params = `client=dict-chrome-ex&sl=auto&tl=${targetLang}&q=${encodedText}`

  const res = await axios.get(`${url}?${params}`, {
    headers: { "User-Agent": "Mozilla/5.0" },
    responseType: "json",
  })

  const translatedText = res.data?.[0]?.[0]

  if (!translatedText) throw new Error("No se pudo traducir el texto")

  return translatedText
}