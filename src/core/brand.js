export const brand = Object.freeze({email:'enveely@nalaro.digital',phone:'085771298582',whatsapp:'6285771298582',milestone:100});
export function supportUrl(message='hai kak, aku mau pesan undangan digital...') {
  return `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(message)}`;
}
