import type { Locale } from "./locale";
import type { ReportReason } from "@/lib/catalog/reports";
import type { Conditions } from "@/lib/catalog/conditions";

export type Messages = {
  nav: {
    home: string;
    map: string;
    learn: string;
    profile: string;
    identify: string;
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
    admin: string;
  };
  signIn: { google: string };
  history: {
    signInTitle: string;
    signInHint: string;
    emptyTitle: string;
    emptyHint: string;
    confidence: string;
  };
  common: {
    loading: string;
    yes: string;
    no: string;
    back: string;
    close: string;
    cancel: string;
  };
  meta: { title: string; description: string };
  landing: {
    homeAria: string;
    how: string;
    capabilities: string;
    openApp: string;
    open: string;
    hero: string;
    lede: string;
    seeCapabilities: string;
    threeSteps: string;
    threeStepsLede: string;
    bogotaLede: string;
    capabilitiesTitle: string;
    skip: string;
    cards: { title: string; tags: string; body: string }[];
  };
  mapUi: {
    filterAria: string;
    locating: string;
    useLocation: string;
    locality: string;
    localityPlaceholder: string;
    search: string;
    clear: string;
    gpsMissing: string;
    gpsDenied: string;
    errorHint: string;
    noResults: string;
    point: string;
    points: string;
    from: string;
    empty: string;
    emptyHint: string;
  };
  dropoff: {
    title: string;
    allLede: string;
    kindLede: string;
    metaTitle: string;
  };
  result: {
    metaTitle: string;
    title: string;
    signInLede: string;
    unclear: string;
    identified: string;
    confidence: string;
    pick: string;
    correct: string;
  };
  guidance: {
    flags: Record<"canUse" | "canReuse" | "canRepair" | "canDonate" | "canRecycle", string>;
    titles: Record<"condition" | "flags" | "risks" | "dos" | "storage" | "data", string>;
    questions: Record<keyof Conditions, string>;
    step: string;
    skip: string;
    next: string;
    seeMap: string;
    skipHint: string;
    special: string;
    doThis: string;
    avoidThis: string;
    storage: string;
    transport: string;
    beforeHandin: string;
  };
  point: {
    recommended: string;
    distance: string;
    acceptsAria: string;
    available: string;
    unavailable: string;
    directions: string;
  };
  report: {
    sendError: string;
    thanks: string;
    action: string;
    signIn: string;
    reasonLegend: string;
    comment: string;
    commentPlaceholder: string;
    sending: string;
    send: string;
    reasons: Record<ReportReason, string>;
  };
  recommended: {
    title: string;
    searching: string;
    nearCenter: string;
    nearNamed: string;
    loading: string;
    error: string;
    mapTitle: string;
    more: string;
  };
  admin: {
    pointsMeta: string;
    reportsMeta: string;
    noAccess: string;
    backApp: string;
    pointsLede: string;
    reportsLede: string;
    reportsWarning: string;
    forbidden: string;
    saveError: string;
    newPoint: string;
    editPoint: string;
    name: string;
    address: string;
    lat: string;
    lng: string;
    locality: string;
    hours: string;
    hoursPlaceholder: string;
    contact: string;
    contactPlaceholder: string;
    accepts: string;
    activeMap: string;
    saving: string;
    save: string;
    active: string;
    inactive: string;
    edit: string;
    deactivate: string;
    reactivate: string;
    noReports: string;
    resolve: string;
    dismiss: string;
  };
};

export const messages: Record<Locale, Messages> = {
  es: {
    nav: {
      home: "Inicio",
      map: "Mapa",
      learn: "Aprende",
      profile: "Perfil",
      identify: "Identificar",
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
      admin: "Administración",
    },
    signIn: { google: "Continuar con Google" },
    history: {
      signInTitle: "Entra con Google para ver tu historial.",
      signInHint: "Identificar pide sesión; ahí se guarda cada aparato.",
      emptyTitle: "Todavía no identificas ningún aparato.",
      emptyHint: "Toma o sube una foto para escanear tu primer electrónico.",
      confidence: "de confianza",
    },
    common: {
      loading: "Cargando…",
      yes: "Sí",
      no: "No",
      back: "Atrás",
      close: "Cerrar",
      cancel: "Cancelar",
    },
    meta: {
      title: "EcoPunto IA - Qué hacer con tus electrónicos viejos en Bogotá",
      description:
        "Le tomas una foto al aparato, la app lo identifica y te muestra dónde llevarlo en Bogotá.",
    },
    landing: {
      homeAria: "EcoPunto IA - inicio",
      how: "Cómo",
      capabilities: "Capacidades",
      openApp: "Abrir la app",
      open: "Abrir",
      hero: "Qué es, y a dónde va en Bogotá",
      lede: "EcoPunto IA identifica tu electrónico con una foto y te muestra puntos de entrega en Bogotá que sí reciben ese residuo.",
      seeCapabilities: "Ver capacidades",
      threeSteps: "3 pasos",
      threeStepsLede: "Foto, identificación y punto de entrega",
      bogotaLede: "Puntos que reciben el tipo de aparato, no solo el más cercano",
      capabilitiesTitle: "Del cajón al punto correcto",
      skip: "Saltar al contenido",
      cards: [
        {
          title: "Identificar",
          tags: "Foto · cámara · galería",
          body: "Fotografía el aparato o súbelo desde tu galería. Si la app se equivoca, lo corriges con un toque y seguimos.",
        },
        {
          title: "Orientar",
          tags: "Riesgos · reusar · reparar",
          body: "Te decimos qué hacer y qué no: si todavía sirve para reusar o reparar, y por qué las pilas jamás van a la caneca de la casa.",
        },
        {
          title: "Llevar",
          tags: "Bogotá · horarios · cómo llegar",
          body: "Puntos de Bogotá que sí reciben ese tipo de residuo, con horarios y la ruta lista para abrir en Google Maps.",
        },
      ],
    },
    mapUi: {
      filterAria: "Filtrar por categoría",
      locating: "Ubicando…",
      useLocation: "Usar mi ubicación",
      locality: "Tu localidad",
      localityPlaceholder: "Kennedy, Suba, Chapinero…",
      search: "Buscar",
      clear: "Limpiar",
      gpsMissing: "Este navegador no tiene geolocalización. Escribe tu localidad.",
      gpsDenied: "No pudimos usar tu ubicación. Escribe tu localidad, por ejemplo Kennedy.",
      errorHint: "Revisa el nombre de la localidad o intenta con tu ubicación.",
      noResults: "Sin resultados desde",
      point: "punto",
      points: "puntos",
      from: "distancias desde",
      empty: "No hay puntos activos para",
      emptyHint: "Prueba con «No sé qué es» para ver todos los puntos de Bogotá.",
    },
    dropoff: {
      title: "¿Dónde lo llevo?",
      allLede: "Todos los puntos activos de Bogotá. Afina la categoría si ya sabes qué es.",
      kindLede: "Puntos de Bogotá que reciben «{kind}». Busca desde tu ubicación o tu localidad.",
      metaTitle: "¿Dónde lo llevo? - EcoPunto IA",
    },
    result: {
      metaTitle: "Resultado - EcoPunto IA",
      title: "Resultado",
      signInLede: "Entra con Google para ver qué identificamos.",
      unclear: "No lo tenemos claro",
      identified: "Identificamos",
      confidence: "Confianza",
      pick: "Elige la categoría",
      correct: "¿No es? Corrige la categoría",
    },
    guidance: {
      flags: {
        canUse: "Usarlo",
        canReuse: "Reusarlo",
        canRepair: "Repararlo",
        canDonate: "Donarlo",
        canRecycle: "Reciclarlo",
      },
      titles: {
        condition: "¿Cómo está el aparato?",
        flags: "Qué se puede",
        risks: "Riesgos",
        dos: "Qué hacer y qué no",
        storage: "Guardar y transportar",
        data: "Tus datos",
      },
      questions: {
        powersOn: "¿Enciende?",
        broken: "¿Está roto?",
        swollenBattery: "¿Batería hinchada?",
        waterExposed: "¿Se mojó?",
      },
      step: "Paso {n} de {total}",
      skip: "Saltar",
      next: "Siguiente",
      seeMap: "Ver en el mapa",
      skipHint: "Opcional. Si no sabes, salta y te mostramos los consejos generales.",
      special: "Necesita manejo especial.",
      doThis: "Haz esto",
      avoidThis: "Evita esto",
      storage: "Cómo guardarlo",
      transport: "Cómo llevarlo",
      beforeHandin: "Antes de entregarlo:",
    },
    point: {
      recommended: "Recomendado",
      distance: "de distancia",
      acceptsAria: "Qué recibe este punto",
      available: "Disponible",
      unavailable: "No disponible",
      directions: "Cómo llegar",
    },
    report: {
      sendError: "No pudimos enviar el reporte.",
      thanks: "Gracias. El punto sigue visible hasta que el equipo lo revise.",
      action: "Reportar un dato",
      signIn: "Entra con Google para reportar.",
      reasonLegend: "Motivo del reporte",
      comment: "Comentario (opcional)",
      commentPlaceholder: "Ej. cambió de dirección hace un mes",
      sending: "Enviando…",
      send: "Enviar reporte",
      reasons: {
        closed: "Está cerrado",
        wrong_address: "Dirección incorrecta",
        wrong_hours: "Horario incorrecto",
        wrong_accepted: "Ya no recibe este residuo",
      },
    },
    recommended: {
      title: "Dónde llevarlo",
      searching: "Buscando el mejor punto…",
      nearCenter: "Cerca del centro de Bogotá",
      nearNamed: "Cerca de {name}",
      loading: "Cargando punto recomendado…",
      error: "No pudimos cargar el punto recomendado.",
      mapTitle: "Mapa de la zona de {name}",
      more: "Ver más puntos",
    },
    admin: {
      pointsMeta: "Administrar puntos - EcoPunto IA",
      reportsMeta: "Reportes de puntos - EcoPunto IA",
      noAccess: "No tienes acceso.",
      backApp: "Volver a la app",
      pointsLede:
        "Crea, edita y desactiva puntos de recolección. Los puntos desactivados no aparecen en el mapa.",
      reportsLede:
        "Datos reportados por la gente. Los puntos siguen visibles hasta que el equipo los revise.",
      reportsWarning:
        "Aplica supabase/migrations/0004_reports.sql en el SQL editor de Supabase.",
      forbidden: "No tienes acceso.",
      saveError: "No pudimos guardar el punto.",
      newPoint: "Nuevo punto",
      editPoint: "Editar punto",
      name: "Nombre",
      address: "Dirección",
      lat: "Latitud",
      lng: "Longitud",
      locality: "Localidad",
      hours: "Horario",
      hoursPlaceholder: "Lun a sáb, 8:00 a 17:00",
      contact: "Contacto (opcional)",
      contactPlaceholder: "Teléfono o correo",
      accepts: "Qué recibe",
      activeMap: "Activo (visible en el mapa)",
      saving: "Guardando…",
      save: "Guardar",
      active: "Activo",
      inactive: "Inactivo",
      edit: "Editar",
      deactivate: "Desactivar",
      reactivate: "Reactivar",
      noReports: "No hay reportes abiertos.",
      resolve: "Resolver",
      dismiss: "Descartar",
    },
  },
  en: {
    nav: {
      home: "Home",
      map: "Map",
      learn: "Learn",
      profile: "Profile",
      identify: "Identify",
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
      admin: "Admin",
    },
    signIn: { google: "Continue with Google" },
    history: {
      signInTitle: "Sign in with Google to see your history.",
      signInHint: "Identify needs a session; that’s where each device is saved.",
      emptyTitle: "You haven’t identified a device yet.",
      emptyHint: "Take or upload a photo to scan your first electronic.",
      confidence: "confidence",
    },
    common: {
      loading: "Loading…",
      yes: "Yes",
      no: "No",
      back: "Back",
      close: "Close",
      cancel: "Cancel",
    },
    meta: {
      title: "EcoPunto IA - What to do with old electronics in Bogotá",
      description:
        "Take a photo of the device. The app identifies it and shows where to take it in Bogotá.",
    },
    landing: {
      homeAria: "EcoPunto IA - home",
      how: "How",
      capabilities: "Capabilities",
      openApp: "Open the app",
      open: "Open",
      hero: "What it is, and where it goes in Bogotá",
      lede: "EcoPunto IA identifies your electronic with a photo and shows Bogotá drop-offs that actually take that waste.",
      seeCapabilities: "See capabilities",
      threeSteps: "3 steps",
      threeStepsLede: "Photo, identification, and a drop-off point",
      bogotaLede: "Points that take that type of device, not just the nearest one",
      capabilitiesTitle: "From the drawer to the right point",
      skip: "Skip to content",
      cards: [
        {
          title: "Identify",
          tags: "Photo · camera · gallery",
          body: "Photograph the device or upload it from your gallery. If the app gets it wrong, you correct it with a tap and we continue.",
        },
        {
          title: "Guide",
          tags: "Risks · reuse · repair",
          body: "We tell you what to do and what not to: if it can still be reused or repaired, and why cells never go in household trash.",
        },
        {
          title: "Drop off",
          tags: "Bogotá · hours · directions",
          body: "Bogotá points that take that waste type, with hours and a route ready to open in Google Maps.",
        },
      ],
    },
    mapUi: {
      filterAria: "Filter by category",
      locating: "Locating…",
      useLocation: "Use my location",
      locality: "Your neighborhood",
      localityPlaceholder: "Kennedy, Suba, Chapinero…",
      search: "Search",
      clear: "Clear",
      gpsMissing: "This browser has no geolocation. Type your neighborhood.",
      gpsDenied: "We couldn’t use your location. Type your neighborhood, for example Kennedy.",
      errorHint: "Check the neighborhood name or try your location.",
      noResults: "No results from",
      point: "point",
      points: "points",
      from: "distances from",
      empty: "No active points for",
      emptyHint: "Try “I don’t know what it is” to see every Bogotá point.",
    },
    dropoff: {
      title: "Where do I take it?",
      allLede: "Every active Bogotá point. Narrow the category if you already know what it is.",
      kindLede: "Bogotá points that take “{kind}”. Search from your location or neighborhood.",
      metaTitle: "Where do I take it? - EcoPunto IA",
    },
    result: {
      metaTitle: "Result - EcoPunto IA",
      title: "Result",
      signInLede: "Sign in with Google to see what we identified.",
      unclear: "We’re not sure",
      identified: "We identified",
      confidence: "Confidence",
      pick: "Pick the category",
      correct: "Not this? Correct the category",
    },
    guidance: {
      flags: {
        canUse: "Use it",
        canReuse: "Reuse it",
        canRepair: "Repair it",
        canDonate: "Donate it",
        canRecycle: "Recycle it",
      },
      titles: {
        condition: "How is the device?",
        flags: "What you can do",
        risks: "Risks",
        dos: "Do and don’t",
        storage: "Store and carry",
        data: "Your data",
      },
      questions: {
        powersOn: "Does it turn on?",
        broken: "Is it broken?",
        swollenBattery: "Swollen battery?",
        waterExposed: "Did it get wet?",
      },
      step: "Step {n} of {total}",
      skip: "Skip",
      next: "Next",
      seeMap: "See on the map",
      skipHint: "Optional. If you’re unsure, skip and we’ll show the general advice.",
      special: "Needs special handling.",
      doThis: "Do this",
      avoidThis: "Avoid this",
      storage: "How to store it",
      transport: "How to carry it",
      beforeHandin: "Before you hand it in:",
    },
    point: {
      recommended: "Recommended",
      distance: "away",
      acceptsAria: "What this point takes",
      available: "Open",
      unavailable: "Unavailable",
      directions: "Directions",
    },
    report: {
      sendError: "We couldn’t send the report.",
      thanks: "Thanks. The point stays visible until the team reviews it.",
      action: "Report a detail",
      signIn: "Sign in with Google to report.",
      reasonLegend: "Reason for the report",
      comment: "Comment (optional)",
      commentPlaceholder: "E.g. it moved a month ago",
      sending: "Sending…",
      send: "Send report",
      reasons: {
        closed: "It’s closed",
        wrong_address: "Wrong address",
        wrong_hours: "Wrong hours",
        wrong_accepted: "It no longer takes this waste",
      },
    },
    recommended: {
      title: "Where to take it",
      searching: "Finding the best point…",
      nearCenter: "Near the center of Bogotá",
      nearNamed: "Near {name}",
      loading: "Loading recommended point…",
      error: "We couldn’t load the recommended point.",
      mapTitle: "Map of the area around {name}",
      more: "See more points",
    },
    admin: {
      pointsMeta: "Manage points - EcoPunto IA",
      reportsMeta: "Point reports - EcoPunto IA",
      noAccess: "You don’t have access.",
      backApp: "Back to the app",
      pointsLede:
        "Create, edit, and deactivate collection points. Inactive points don’t show on the map.",
      reportsLede:
        "Details reported by people. Points stay visible until the team reviews them.",
      reportsWarning:
        "Apply supabase/migrations/0004_reports.sql in the Supabase SQL editor.",
      forbidden: "You don’t have access.",
      saveError: "We couldn’t save the point.",
      newPoint: "New point",
      editPoint: "Edit point",
      name: "Name",
      address: "Address",
      lat: "Latitude",
      lng: "Longitude",
      locality: "Neighborhood",
      hours: "Hours",
      hoursPlaceholder: "Mon to Sat, 8:00 to 17:00",
      contact: "Contact (optional)",
      contactPlaceholder: "Phone or email",
      accepts: "What it takes",
      activeMap: "Active (visible on the map)",
      saving: "Saving…",
      save: "Save",
      active: "Active",
      inactive: "Inactive",
      edit: "Edit",
      deactivate: "Deactivate",
      reactivate: "Reactivate",
      noReports: "No open reports.",
      resolve: "Resolve",
      dismiss: "Dismiss",
    },
  },
};
