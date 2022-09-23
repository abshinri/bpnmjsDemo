import translations from "./zh";

export default function customTranslate(template: any, replacements: any) {
  replacements = replacements || {};

  // Translate
  template = translations[template as keyof typeof translations] || template;

  // Replace
  return template.replace(/{([^}]+)}/g, function (_: any, key: string) {
    let str: string = replacements[key];
    const translation: string = translations[str as keyof typeof translations];
    if (translation !== null && translation !== "undefined") {
      str = translation;
    }
    return str || "{" + key + "}";
  });
}
