import { useEffect } from "react";

const GoogleTranslate = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(script);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "sw", // Default site language
          includedLanguages: "en,sw", // Allow English & Swahili
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };
  }, []);

  return (
    <div style={{ display: "none" }}>
      <div id="google_translate_element" style={{ display: "none" }}></div>
    </div>
  );
};

export default GoogleTranslate;
