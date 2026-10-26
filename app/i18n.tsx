"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const en = {
  subtitle: "Privacy-preserving KYC on Stellar",
  verifyTitle: "Verify your eligibility",
  verifySub: "Prove you meet the requirements without revealing your data.",
  policy: "Policy (set by the verifier)",
  minAge: "Minimum age",
  allowedCodes: "Allowed codes",
  codesHint: "Separate country codes with commas.",
  yourAge: "Your age",
  yourCountry: "Your country code",
  private: "Private",
  agePh: "Enter your age",
  requirements: "Requirements",
  minAgeReq: "Minimum age:",
  allowedReq: "Allowed countries:",
  neverRevealed: "Your actual data is never revealed on-chain.",
  verifyBtn: "Verify with ZK proof",
  generating: "Generating ZK proof...",
  verified: "KYC verified",
  verifiedSub: "Requirements met (simulated proof).",
  viewContract: "View contract on Stellar Expert",
  failed: "Verification failed",
  failedSub: "The requirements were not met.",
  recent: "Recent attempts",
  recentSub: "Demo data, stored only in this browser. Your inputs are not saved.",
  clear: "Clear",
  ok: "Verified",
  fail: "Failed",
  hiwTitle: "How it works",
  hiwSub: "Prove a fact about yourself without handing over the data.",
  step: "Step",
  s1t: "Enter private inputs",
  s1b: "Your age and country code stay in your browser. They are never sent anywhere.",
  s2t: "Generate a ZK proof",
  s2b: "A zero-knowledge proof shows you meet the rules without revealing the values behind them.",
  s3t: "Verify on Stellar",
  s3b: "A Soroban smart contract checks the proof on-chain. Only pass or fail is public.",
  footer: "Privacy-preserving KYC on Stellar | Testnet demo",
  source: "Source on GitHub",
  connect: "Connect wallet",
  connecting: "Connecting...",
  contract: "Contract",
  copy: "Copy contract ID",
  copied: "Copied",
  onchainYes: "Verified on-chain",
  onchainNo: "Not verified yet",
  signing: "Waiting for wallet signature...",
  viewTx: "View transaction",
  txFailed: "On-chain submission failed",
};

export type Key = keyof typeof en;

const sw: Record<Key, string> = {
  subtitle: "KYC inayolinda faragha kwenye Stellar",
  verifyTitle: "Thibitisha ustahiki wako",
  verifySub: "Thibitisha unakidhi masharti bila kufichua data yako.",
  policy: "Sera (inawekwa na mthibitishaji)",
  minAge: "Umri wa chini",
  allowedCodes: "Misimbo inayoruhusiwa",
  codesHint: "Tenganisha misimbo ya nchi kwa koma.",
  yourAge: "Umri wako",
  yourCountry: "Msimbo wa nchi yako",
  private: "Siri",
  agePh: "Weka umri wako",
  requirements: "Masharti",
  minAgeReq: "Umri wa chini:",
  allowedReq: "Nchi zinazoruhusiwa:",
  neverRevealed: "Data yako halisi haifichuliwi kamwe kwenye mnyororo.",
  verifyBtn: "Thibitisha kwa ZK proof",
  generating: "Inaunda ZK proof...",
  verified: "KYC imethibitishwa",
  verifiedSub: "Masharti yametimizwa (uthibitisho wa majaribio).",
  viewContract: "Tazama mkataba kwenye Stellar Expert",
  failed: "Uthibitisho umeshindwa",
  failedSub: "Masharti hayakutimizwa.",
  recent: "Majaribio ya hivi karibuni",
  recentSub: "Data ya majaribio, huhifadhiwa kwenye kivinjari hiki pekee. Ulichoingiza hakihifadhiwi.",
  clear: "Futa",
  ok: "Imethibitishwa",
  fail: "Imeshindwa",
  hiwTitle: "Jinsi inavyofanya kazi",
  hiwSub: "Thibitisha ukweli kukuhusu bila kutoa data yako.",
  step: "Hatua",
  s1t: "Weka taarifa za siri",
  s1b: "Umri na msimbo wa nchi yako hubaki kwenye kivinjari chako. Hazitumwi popote.",
  s2t: "Unda ZK proof",
  s2b: "Uthibitisho wa zero-knowledge unaonyesha unakidhi masharti bila kufichua thamani zilizo nyuma yake.",
  s3t: "Thibitisha kwenye Stellar",
  s3b: "Mkataba mahiri wa Soroban hukagua uthibitisho kwenye mnyororo. Ni matokeo tu (imefaulu au imeshindwa) yanayoonekana hadharani.",
  footer: "KYC inayolinda faragha kwenye Stellar | Toleo la majaribio la Testnet",
  source: "Msimbo chanzo kwenye GitHub",
  connect: "Unganisha pochi",
  connecting: "Inaunganisha...",
  contract: "Mkataba",
  copy: "Nakili kitambulisho cha mkataba",
  copied: "Imenakiliwa",
  onchainYes: "Imethibitishwa kwenye mnyororo",
  onchainNo: "Bado haijathibitishwa",
  signing: "Inasubiri sahihi ya pochi...",
  viewTx: "Tazama muamala",
  txFailed: "Kutuma kwenye mnyororo kumeshindwa",
};

const fr: Record<Key, string> = {
  subtitle: "KYC respectueux de la vie privée sur Stellar",
  verifyTitle: "Vérifiez votre éligibilité",
  verifySub: "Prouvez que vous remplissez les conditions sans révéler vos données.",
  policy: "Politique (définie par le vérificateur)",
  minAge: "Âge minimum",
  allowedCodes: "Codes autorisés",
  codesHint: "Séparez les indicatifs pays par des virgules.",
  yourAge: "Votre âge",
  yourCountry: "Indicatif de votre pays",
  private: "Privé",
  agePh: "Entrez votre âge",
  requirements: "Conditions",
  minAgeReq: "Âge minimum :",
  allowedReq: "Pays autorisés :",
  neverRevealed: "Vos données réelles ne sont jamais révélées on-chain.",
  verifyBtn: "Vérifier avec une preuve ZK",
  generating: "Génération de la preuve ZK...",
  verified: "KYC vérifié",
  verifiedSub: "Conditions remplies (preuve simulée).",
  viewContract: "Voir le contrat sur Stellar Expert",
  failed: "Échec de la vérification",
  failedSub: "Les conditions ne sont pas remplies.",
  recent: "Tentatives récentes",
  recentSub: "Données de démo, stockées uniquement dans ce navigateur. Vos saisies ne sont pas enregistrées.",
  clear: "Effacer",
  ok: "Vérifié",
  fail: "Échec",
  hiwTitle: "Comment ça marche",
  hiwSub: "Prouvez un fait vous concernant sans transmettre vos données.",
  step: "Étape",
  s1t: "Saisissez vos données privées",
  s1b: "Votre âge et votre indicatif pays restent dans votre navigateur. Ils ne sont envoyés nulle part.",
  s2t: "Générez une preuve ZK",
  s2b: "Une preuve à divulgation nulle de connaissance montre que vous respectez les règles sans révéler les valeurs sous-jacentes.",
  s3t: "Vérifiez sur Stellar",
  s3b: "Un contrat intelligent Soroban vérifie la preuve on-chain. Seul le résultat (réussite ou échec) est public.",
  footer: "KYC respectueux de la vie privée sur Stellar | Démo Testnet",
  source: "Code source sur GitHub",
  connect: "Connecter le portefeuille",
  connecting: "Connexion...",
  contract: "Contrat",
  copy: "Copier l'ID du contrat",
  copied: "Copié",
  onchainYes: "Vérifié on-chain",
  onchainNo: "Pas encore vérifié",
  signing: "En attente de la signature du portefeuille...",
  viewTx: "Voir la transaction",
  txFailed: "Échec de la soumission on-chain",
};

const es: Record<Key, string> = {
  subtitle: "KYC que protege la privacidad en Stellar",
  verifyTitle: "Verifica tu elegibilidad",
  verifySub: "Demuestra que cumples los requisitos sin revelar tus datos.",
  policy: "Política (definida por el verificador)",
  minAge: "Edad mínima",
  allowedCodes: "Códigos permitidos",
  codesHint: "Separa los códigos de país con comas.",
  yourAge: "Tu edad",
  yourCountry: "Código de tu país",
  private: "Privado",
  agePh: "Ingresa tu edad",
  requirements: "Requisitos",
  minAgeReq: "Edad mínima:",
  allowedReq: "Países permitidos:",
  neverRevealed: "Tus datos reales nunca se revelan on-chain.",
  verifyBtn: "Verificar con prueba ZK",
  generating: "Generando prueba ZK...",
  verified: "KYC verificado",
  verifiedSub: "Requisitos cumplidos (prueba simulada).",
  viewContract: "Ver contrato en Stellar Expert",
  failed: "Verificación fallida",
  failedSub: "No se cumplieron los requisitos.",
  recent: "Intentos recientes",
  recentSub: "Datos de demostración, guardados solo en este navegador. Lo que ingresas no se guarda.",
  clear: "Borrar",
  ok: "Verificado",
  fail: "Fallido",
  hiwTitle: "Cómo funciona",
  hiwSub: "Demuestra un hecho sobre ti sin entregar tus datos.",
  step: "Paso",
  s1t: "Ingresa datos privados",
  s1b: "Tu edad y el código de país se quedan en tu navegador. No se envían a ninguna parte.",
  s2t: "Genera una prueba ZK",
  s2b: "Una prueba de conocimiento cero demuestra que cumples las reglas sin revelar los valores que hay detrás.",
  s3t: "Verifica en Stellar",
  s3b: "Un contrato inteligente de Soroban comprueba la prueba on-chain. Solo el resultado (aprobado o fallido) es público.",
  footer: "KYC que protege la privacidad en Stellar | Demo en Testnet",
  source: "Código fuente en GitHub",
  connect: "Conectar billetera",
  connecting: "Conectando...",
  contract: "Contrato",
  copy: "Copiar ID del contrato",
  copied: "Copiado",
  onchainYes: "Verificado on-chain",
  onchainNo: "Aún no verificado",
  signing: "Esperando la firma de la billetera...",
  viewTx: "Ver transacción",
  txFailed: "Falló el envío on-chain",
};

const ar: Record<Key, string> = {
  subtitle: "التحقق من الهوية (KYC) مع حماية الخصوصية على Stellar",
  verifyTitle: "تحقق من أهليتك",
  verifySub: "أثبت أنك تستوفي الشروط دون الكشف عن بياناتك.",
  policy: "السياسة (يحددها الجهة المُتحققة)",
  minAge: "الحد الأدنى للعمر",
  allowedCodes: "الرموز المسموح بها",
  codesHint: "افصل رموز الدول بفواصل.",
  yourAge: "عمرك",
  yourCountry: "رمز دولتك",
  private: "خاص",
  agePh: "أدخل عمرك",
  requirements: "الشروط",
  minAgeReq: "الحد الأدنى للعمر:",
  allowedReq: "الدول المسموح بها:",
  neverRevealed: "لا يتم الكشف عن بياناتك الفعلية على السلسلة أبدًا.",
  verifyBtn: "تحقق بإثبات ZK",
  generating: "جارٍ إنشاء إثبات ZK...",
  verified: "تم التحقق من KYC",
  verifiedSub: "تم استيفاء الشروط (إثبات تجريبي).",
  viewContract: "عرض العقد على Stellar Expert",
  failed: "فشل التحقق",
  failedSub: "لم يتم استيفاء الشروط.",
  recent: "المحاولات الأخيرة",
  recentSub: "بيانات تجريبية تُحفظ في هذا المتصفح فقط. لا يتم حفظ مدخلاتك.",
  clear: "مسح",
  ok: "تم التحقق",
  fail: "فشل",
  hiwTitle: "كيف يعمل",
  hiwSub: "أثبت حقيقة عن نفسك دون تسليم بياناتك.",
  step: "الخطوة",
  s1t: "أدخل بياناتك الخاصة",
  s1b: "يبقى عمرك ورمز دولتك داخل متصفحك. لا يتم إرسالهما إلى أي مكان.",
  s2t: "أنشئ إثبات ZK",
  s2b: "يُظهر إثبات المعرفة الصفرية أنك تستوفي القواعد دون كشف القيم الكامنة وراءها.",
  s3t: "تحقق على Stellar",
  s3b: "يفحص عقد Soroban الذكي الإثبات على السلسلة. النتيجة فقط (نجاح أو فشل) تكون علنية.",
  footer: "التحقق من الهوية مع حماية الخصوصية على Stellar | عرض تجريبي على Testnet",
  source: "الشيفرة المصدرية على GitHub",
  connect: "ربط المحفظة",
  connecting: "جارٍ الاتصال...",
  contract: "العقد",
  copy: "نسخ معرّف العقد",
  copied: "تم النسخ",
  onchainYes: "تم التحقق على السلسلة",
  onchainNo: "لم يتم التحقق بعد",
  signing: "في انتظار توقيع المحفظة...",
  viewTx: "عرض المعاملة",
  txFailed: "فشل الإرسال على السلسلة",
};

const dict = { en, sw, fr, es, ar };
export type Lang = keyof typeof dict;

export const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "sw", label: "Kiswahili" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "ar", label: "العربية" },
];

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: Key) => string };
const I18nContext = createContext<Ctx>({ lang: "en", setLang: () => {}, t: (k) => en[k] });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    let l: Lang = "en";
    try {
      const saved = localStorage.getItem("lang");
      if (saved && saved in dict) l = saved as Lang;
      else {
        const nav = navigator.language.slice(0, 2);
        if (nav in dict) l = nav as Lang;
      }
    } catch {}
    setLangState(l);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("lang", l);
    } catch {}
  };

  const t = (k: Key) => dict[lang][k];

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);