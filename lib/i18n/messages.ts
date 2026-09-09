import type { Locale } from "./locale";

export type Messages = {
  nav: {
    home: string;
    map: string;
    learn: string;
    profile: string;
    site: string;
    main: string;
    language: string;
  };
  home: { title: string; lede: string; history: string };
  learn: {
    title: string;
    lede: string;
    photo: string;
    points: string;
    metaTitle: string;
  };
  capture: {
    photo: string;
    gallery: string;
    uploading: string;
    identifying: string;
    error: string;
    photoAria: string;
    galleryAria: string;
  };
  map: { title: string; lede: string; metaTitle: string };
  profile: {
    title: string;
    lede: string;
    session: string;
    signOut: string;
    points: string;
    reports: string;
    metaTitle: string;
  };
  signIn: { google: string };
    history: {
      signInTitle: string;
      signInHint: string;
      emptyTitle: string;
      emptyHint: string;
      confidence: string;
    };
};

export const messages: Record<Locale, Messages> = {
  es: {
    nav: {
      home: "Inicio",
      map: "Mapa",
      learn: "Aprende",
      profile: "Perfil",
      site: "EcoPunto IA - sitio",
      main: "Navegación principal",
      language: "Idioma",
    },
    home: {
      title: "Inicio",
      lede: "Una foto identifica tu aparato y te dice a qué punto de Bogotá llevarlo.",
      history: "Historial",
    },
    learn: {
      title: "Aprende",
      lede: "En Bogotá cada aparato va a un circuito distinto. Si no sabes cuál, sácale una foto en Inicio.",
      photo: "Sacar una foto",
      points: "Ver puntos",
      metaTitle: "Aprende - EcoPunto IA",
    },
    capture: {
      photo: "Tomar foto",
      gallery: "Subir de la galería",
      uploading: "Subiendo la foto…",
      identifying: "Identificando el aparato…",
      error: "No pudimos procesar la foto. Intenta de nuevo.",
      photoAria: "Tomar una foto con la cámara",
      galleryAria: "Elegir una foto de la galería",
    },
    map: {
      title: "Mapa",
      lede: "Los puntos de Bogotá que reciben tu aparato. Filtra por categoría y busca desde tu ubicación o tu localidad.",
      metaTitle: "Mapa - EcoPunto IA",
    },
    profile: {
      title: "Perfil",
      lede: "Entra con Google. No hay usuario ni contraseña.",
      session: "Sesión con Google",
      signOut: "Cerrar sesión",
      points: "Puntos",
      reports: "Reportes",
      metaTitle: "Perfil - EcoPunto IA",
    },
    signIn: { google: "Continuar con Google" },
    history: {
      signInTitle: "Entra con Google para ver tu historial.",
      signInHint: "Identificar pide sesión; ahí se guarda cada aparato.",
      emptyTitle: "Todavía no identificas ningún aparato.",
      emptyHint: "Toma o sube una foto para escanear tu primer electrónico.",
      confidence: "de confianza",
    },
  },
  en: {
    nav: {
      home: "Home",
      map: "Map",
      learn: "Learn",
      profile: "Profile",
      site: "EcoPunto IA - site",
      main: "Main navigation",
      language: "Language",
    },
    home: {
      title: "Home",
      lede: "A photo identifies your device and shows a Bogotá drop-off that actually takes it.",
      history: "History",
    },
    learn: {
      title: "Learn",
      lede: "In Bogotá each device follows a different circuit. If you’re unsure, take a photo on Home.",
      photo: "Take a photo",
      points: "See points",
      metaTitle: "Learn - EcoPunto IA",
    },
    capture: {
      photo: "Take photo",
      gallery: "Upload from gallery",
      uploading: "Uploading the photo…",
      identifying: "Identifying the device…",
      error: "We couldn’t process the photo. Try again.",
      photoAria: "Take a photo with the camera",
      galleryAria: "Choose a photo from the gallery",
    },
    map: {
      title: "Map",
      lede: "Bogotá points that take your device. Filter by type and search from your location or neighborhood.",
      metaTitle: "Map - EcoPunto IA",
    },
    profile: {
      title: "Profile",
      lede: "Sign in with Google. No username or password.",
      session: "Signed in with Google",
      signOut: "Sign out",
      points: "Points",
      reports: "Reports",
      metaTitle: "Profile - EcoPunto IA",
    },
    signIn: { google: "Continue with Google" },
    history: {
      signInTitle: "Sign in with Google to see your history.",
      signInHint: "Identify needs a session; that’s where each device is saved.",
      emptyTitle: "You haven’t identified a device yet.",
      emptyHint: "Take or upload a photo to scan your first electronic.",
      confidence: "confidence",
    },
  },
};
