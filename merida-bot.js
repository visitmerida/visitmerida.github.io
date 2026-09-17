/* Visit Merida chat assistant — zero-backend Q&A + affiliate sales bot.
   Drop-in: <script src="/merida-bot.js" defer></script> before </body>.
   Detects page language (EN/ES/FR), answers from a local knowledge base,
   suggests affiliate links (with disclosure) and follower CTAs. No data leaves the browser. */
(function () {
  "use strict";

  /* ---------- language ---------- */
  var PATH = (location.pathname || "").toLowerCase();
  var LANG = /-fr\.html/.test(PATH) ? "fr" : (/-es\.html/.test(PATH) ? "es" : "en");

  function pg(base) {
    // localized page filenames (only these have translations)
    var loc = { index: 1, tours: 1, tips: 1, guide: 1 };
    var names = { index: "index", tours: "tours", tips: "tips", guide: "starter-guide",
                daytrips: "day-trips", cenotes: "cenotes", food: "food",
                practical: "practical", freeevents: "free-events" };
    if (!names[base]) return base + ".html";
    return names[base] + (LANG === "es" ? "-es" : LANG === "fr" ? "-fr" : "") + ".html";
  }

  /* ---------- links ---------- */
  var AFF = {
    kiwitaxi:  "https://kiwitaxi.tpx.gr/7BqB0ITi",
    airalo:    "https://airalo.tpx.gr/ASLWmMl1",
    localrent: "https://localrent.tpx.gr/TopRS8Za",
    getrent:   "https://getrentacar.tpx.gr/rZxf0XYl",
    tiqets:    "https://tiqets.tpx.gr/8yHozhLk",
    klook:     "https://klook.tpx.gr/uef3Fj1z",
    wegotrip:  "https://wegotrip.tpx.gr/eVxve2iA",
    vChichen:  "https://www.viator.com/tours/Merida/Chichen-Itza-Full-Day-Tour/d5195-298748P1?pid=P00320508&uid=U00867471&mcid=58086&currency=USD",
    vUxmal:    "https://www.viator.com/tours/Merida/Tour-to-Uxmal-Cenote-and-Chocolate-Museum-from-Merida/d5195-325320P2?pid=P00320508&uid=U00867471&mcid=58086&currency=USD",
    vSB:       "https://www.viator.com/tours/Merida/Tour-Cenotes-Santa-Barbara/d5195-123389P1?pid=P00320508&uid=U00867471&mcid=58086&currency=USD",
    v5C:       "https://www.viator.com/tours/Merida/Explore-the-magical-world-of-Yucatan-Cenotes/d5195-140382P5?pid=P00320508&uid=U00867471&mcid=58086&currency=USD",
    vCelestun: "https://www.viator.com/tours/Merida/Celestun-Flamingos-Beach-and-Seafood-Tour-departure-from-Merida/d5195-472923P4?pid=P00320508&uid=U00867471&mcid=58086&currency=USD",
    airbnb:    "https://www.airbnb.com/s/Merida--Yucatan--Mexico"
  };
  var FOLLOW = {
    ig: "https://www.instagram.com/visitmerida.mx/",
    fb: "https://www.facebook.com/groups/1060703043502508",
    th: "https://www.threads.com/@visitmerida.mx",
    nl: "https://buttondown.com/this-week-in-merida"
  };

  var DISC = {
    en: "(Affiliate link \u2014 I may earn a commission at no extra cost to you.)",
    es: "(Enlace de afiliado: puedo ganar una comisi\u00f3n sin costo adicional para ti.)",
    fr: "(Lien d\u2019affiliation : je peux percevoir une commission, sans frais suppl\u00e9mentaires.)"
  };

  function a(url, label) {
    return '<a href="' + url + '" target="_blank" rel="noopener sponsored">' + label + "</a>";
  }
  function go(base, label) { return a(pg(base), label); }

  var LBL = {
    bookTransfer: { en: "book a private airport transfer", es: "reservar un traslado privado del aeropuerto", fr: "r\u00e9server un transfert priv\u00e9 depuis l\u2019a\u00e9roport" },
    esim:         { en: "Mexico eSIM from $4", es: "eSIM de M\u00e9xico desde $4", fr: "eSIM Mexique d\u00e8s 4 $" },
    carA:         { en: "compare car rentals (Localrent)", es: "comparar alquiler de autos (Localrent)", fr: "comparer les locations de voiture (Localrent)" },
    carB:         { en: "GetRentacar", es: "GetRentacar", fr: "GetRentacar" },
    chichenTour:  { en: "book the Chich\u00e9n Itz\u00e1 day tour", es: "reservar el tour a Chich\u00e9n Itz\u00e1", fr: "r\u00e9server l\u2019excursion \u00e0 Chich\u00e9n Itz\u00e1" },
    chichenTick:  { en: "entry tickets", es: "boletos de entrada", fr: "billets d\u2019entr\u00e9e" },
    uxmalTour:    { en: "Uxmal day tour", es: "tour a Uxmal", fr: "excursion \u00e0 Uxmal" },
    sbTour:       { en: "Santa B\u00e1rbara cenotes tour", es: "tour a los cenotes de Santa B\u00e1rbara", fr: "excursion aux c\u00e9notes de Santa B\u00e1rbara" },
    c5Tour:       { en: "5-cenote private tour", es: "tour privado de 5 cenotes", fr: "excursion priv\u00e9e 5 c\u00e9notes" },
    celTour:      { en: "Celest\u00fan flamingo boat tour", es: "tour en lancha de flamencos en Celest\u00fan", fr: "excursion en bateau aux flamants \u00e0 Celest\u00fan" },
    audioTour:    { en: "self-guided audio tour (\u20ac10)", es: "audiotour autoguiado (\u20ac10)", fr: "visite audio autoguid\u00e9e (10 \u20ac)" },
    airbnb:       { en: "browse M\u00e9rida stays on Airbnb", es: "ver alojamientos en Airbnb", fr: "voir les logements sur Airbnb" },
    guide:        { en: "free M\u00e9rida Starter Guide", es: "Gu\u00eda gratuita de M\u00e9rida", fr: "Guide gratuit de M\u00e9rida" },
    newsletter:   { en: "This Week in M\u00e9rida (free weekly email)", es: "This Week in M\u00e9rida (correo semanal gratis)", fr: "This Week in M\u00e9rida (e-mail hebdo gratuit)" }
  };

  /* ---------- knowledge base ---------- */
  // k: keywords per language, t: answer template per language.
  // Tokens: {aff:name} {go:base} {lbl:key} replaced at render time.
  var KB = [
    { id: "greeting",
      k: { en: ["hello", "hi", "hey", "good morning", "good afternoon"],
           es: ["hola", "buenas", "buenos dias", "buenas tardes", "hey"],
           fr: ["bonjour", "salut", "bonsoir", "coucou", "hello"] },
      t: { en: "Hi! I'm the Visit M\u00e9rida assistant. Ask me about cenotes, ruins, food, getting around \u2014 or tap a topic below.",
           es: "\u00a1Hola! Soy el asistente de Visit M\u00e9rida. Preg\u00fantame sobre cenotes, ruinas, comida o transporte \u2014 o toca un tema.",
           fr: "Salut ! Je suis l\u2019assistant Visit M\u00e9rida. Posez-moi vos questions sur les c\u00e9notes, les ruines, la gastronomie, les transports \u2014 ou touchez un sujet." } },

    { id: "guide",
      k: { en: ["guide", "newsletter", "pdf", "free", "ebook", "starter", "tips email"],
           es: ["guia", "boletin", "pdf", "gratis", "gratuita", "correo"],
           fr: ["guide", "infolettre", "pdf", "gratuit", "gratuite", "e-mail"] },
      t: { en: "Start here: our {go:guide} covers the essentials. Want weekly tips too? Join {nl:newsletter}.",
           es: "Empieza aqu\u00ed: nuestra {go:guide} cubre lo esencial. \u00bfQuieres consejos semanales? \u00danete a {nl:newsletter}.",
           fr: "Commencez ici : notre {go:guide} couvre l\u2019essentiel. Des conseils chaque semaine ? Recevez {nl:newsletter}." } },

    { id: "follow",
      k: { en: ["instagram", "follow", "facebook", "threads", "tiktok", "social"],
           es: ["instagram", "seguir", "siguenos", "facebook", "threads", "redes"],
           fr: ["instagram", "suivre", "suivez", "facebook", "threads", "r\u00e9seaux"] },
      t: { en: "Follow along for daily M\u00e9rida photos and tips: {soc:ig} \u00b7 {soc:fb} \u00b7 {soc:th}",
           es: "S\u00edguenos para fotos y consejos diarios de M\u00e9rida: {soc:ig} \u00b7 {soc:fb} \u00b7 {soc:th}",
           fr: "Suivez-nous pour des photos et conseils quotidiens sur M\u00e9rida : {soc:ig} \u00b7 {soc:fb} \u00b7 {soc:th}" } },

    { id: "airport",
      k: { en: ["airport", "flight", "fly", "arrive", "landing", "transfer", "mid airport"],
           es: ["aeropuerto", "vuelo", "volar", "llegar", "llegada", "traslado"],
           fr: ["aeroport", "vol", "atterrir", "arrivee", "transfert"] },
      t: { en: "From M\u00e9rida airport (MID), the easiest option is a pre-booked private transfer \u2014 fixed price, driver waiting with your name: {aff:kiwitaxi|bookTransfer} {disc} Cheaper: Uber/DiDi from the terminal, or the ADO bus to Centro. More: {go:practical}.",
           es: "Desde el aeropuerto de M\u00e9rida (MID), lo m\u00e1s f\u00e1cil es un traslado privado reservado \u2014 precio fijo y conductor esper\u00e1ndote: {aff:kiwitaxi|bookTransfer} {disc} M\u00e1s barato: Uber/DiDi o el autob\u00fas ADO al Centro. M\u00e1s info: {go:practical}.",
           fr: "Depuis l\u2019a\u00e9roport de M\u00e9rida (MID), le plus simple est un transfert priv\u00e9 r\u00e9serv\u00e9 \u2014 prix fixe, chauffeur avec votre nom : {aff:kiwitaxi|bookTransfer} {disc} Moins cher : Uber/DiDi ou le bus ADO vers le Centro. Plus d\u2019infos : {go:practical}." } },

    { id: "stay",
      k: { en: ["hotel", "stay", "sleep", "accommodation", "airbnb", "where to stay", "hostel"],
           es: ["hotel", "hospedaje", "dormir", "alojamiento", "airbnb", "donde alojarse", "hostal"],
           fr: ["hotel", "hebergement", "dormir", "logement", "airbnb", "ou dormir", "auberge"] },
      t: { en: "Stay in Centro (walkable, colonial) or Paseo de Montejo / Garc\u00eda Giner\u00e9s for quieter streets. Compare options: {aff:airbnb|airbnb}. More tips: {go:tips}.",
           es: "Al\u00f3jate en el Centro (caminable, colonial) o en Paseo de Montejo / Garc\u00eda Giner\u00e9s si prefieres tranquilidad. Compara opciones: {aff:airbnb|airbnb}. M\u00e1s consejos: {go:tips}.",
           fr: "Logez dans le Centro (accessible \u00e0 pied, colonial) ou vers Paseo de Montejo / Garc\u00eda Giner\u00e9s pour plus de calme. Comparez : {aff:airbnb|airbnb}. Plus de conseils : {go:tips}." } },

    { id: "cenotes",
      k: { en: ["cenote", "swim", "swimming", "sinkhole"],
           es: ["cenote", "nadar", "nado"],
           fr: ["cenote", "nager", "baignade"] },
      t: { en: "Don't miss Santa B\u00e1rbara (3 cenotes + lunch, easy from M\u00e9rida) and the Hom\u00fan ring for a multi-cenote day: {aff:vSB|sbTour} {disc} or the {aff:v5C|c5Tour} {disc}. Full list: {go:cenotes}.",
           es: "No te pierdas Santa B\u00e1rbara (3 cenotes + almuerzo, f\u00e1cil desde M\u00e9rida) ni el anillo de Hom\u00fan: {aff:vSB|sbTour} {disc} o el {aff:v5C|c5Tour} {disc}. Lista completa: {go:cenotes}.",
           fr: "\u00c0 ne pas manquer : Santa B\u00e1rbara (3 c\u00e9notes + d\u00e9jeuner, facile depuis M\u00e9rida) et l\u2019anneau de Hom\u00fan : {aff:vSB|sbTour} {disc} ou l\u2019{aff:v5C|c5Tour} {disc}. Liste compl\u00e8te : {go:cenotes}." } },

    { id: "chichen",
      k: { en: ["chichen", "chichen itza", "wonder of the world"],
           es: ["chichen", "chichen itza", "maravilla"],
           fr: ["chichen", "chichen itza", "merveille"] },
      t: { en: "Chich\u00e9n Itz\u00e1 is ~2h east \u2014 go early for fewer crowds and pair it with Cenote Ik Kil. {aff:vChichen|chichenTour} {disc} or just {aff:tiqets|chichenTick} {disc}. Details: {go:daytrips}.",
           es: "Chich\u00e9n Itz\u00e1 est\u00e1 a ~2h al este \u2014 ve temprano y comb\u00ednalo con el cenote Ik Kil. {aff:vChichen|chichenTour} {disc} o solo {aff:tiqets|chichenTick} {disc}. Detalles: {go:daytrips}.",
           fr: "Chich\u00e9n Itz\u00e1 est \u00e0 ~2h \u00e0 l\u2019est \u2014 allez-y t\u00f4t et combinez avec le c\u00e9note Ik Kil. {aff:vChichen|chichenTour} {disc} ou simplement {aff:tiqets|chichenTick} {disc}. D\u00e9tails : {go:daytrips}." } },

    { id: "ruins",
      k: { en: ["uxmal", "izamal", "valladolid", "ek balam", "ruins", "maya", "pyramid", "archaeological"],
           es: ["uxmal", "izamal", "valladolid", "ek balam", "ruinas", "maya", "piramide", "arqueologica"],
           fr: ["uxmal", "izamal", "valladolid", "ek balam", "ruines", "maya", "pyramide", "archeologique"] },
      t: { en: "Beyond Chich\u00e9n Itz\u00e1: Uxmal (the connoisseur's favorite), Izamal the Yellow City, and Ek Balam where you can still climb. {aff:vUxmal|uxmalTour} {disc}. All routes: {go:daytrips}.",
           es: "M\u00e1s all\u00e1 de Chich\u00e9n Itz\u00e1: Uxmal (la favorita de los conocedores), Izamal la Ciudad Amarilla y Ek Balam donde a\u00fan se puede subir. {aff:vUxmal|uxmalTour} {disc}. Todas las rutas: {go:daytrips}.",
           fr: "Au-del\u00e0 de Chich\u00e9n Itz\u00e1 : Uxmal (la pr\u00e9f\u00e9r\u00e9e des connaisseurs), Izamal la ville jaune et Ek Balam o\u00f9 l\u2019on peut encore grimper. {aff:vUxmal|uxmalTour} {disc}. Tous les itin\u00e9raires : {go:daytrips}." } },

    { id: "food",
      k: { en: ["food", "eat", "restaurant", "taco", "cochinita", "marquesita", "sopa de lima", "dinner", "lunch", "breakfast"],
           es: ["comida", "comer", "restaurante", "taco", "cochinita", "marquesita", "sopa de lima", "cena", "almuerzo", "desayuno"],
           fr: ["nourriture", "manger", "restaurant", "taco", "cochinita", "diner", "dejeuner", "petit dejeuner"] },
      t: { en: "Try cochinita pibil, sopa de lima, and marquesitas from street carts. Mercado Lucas de G\u00e1lvez is the classic food market. Full guide: {go:food}.",
           es: "Prueba la cochinita pibil, la sopa de lima y las marquesitas de los carritos. El mercado Lucas de G\u00e1lvez es el cl\u00e1sico. Gu\u00eda completa: {go:food}.",
           fr: "Go\u00fbtez la cochinita pibil, la sopa de lima et les marquesitas des vendeurs ambulants. Le march\u00e9 Lucas de G\u00e1lvez est l\u2019incontournable. Guide complet : {go:food}." } },

    { id: "citytransport",
      k: { en: ["bus", "uber", "didi", "taxi", "colectivo", "get around", "transport", "va y ven"],
           es: ["autobus", "camion", "uber", "didi", "taxi", "colectivo", "moverse", "transporte", "va y ven"],
           fr: ["bus", "uber", "didi", "taxi", "colectivo", "se deplacer", "transport", "va y ven"] },
      t: { en: "In the city: Va y Ven buses (smart card), colectivos (cheap shared vans), Uber/DiDi (upfront pricing, best at night). Always agree taxi fares before getting in. Full breakdown: {go:practical}.",
           es: "En la ciudad: autobuses Va y Ven (tarjeta inteligente), colectivos (baratos), Uber/DiDi (precio por adelantado, ideal de noche). Acuerda siempre la tarifa del taxi antes de subir. Detalles: {go:practical}.",
           fr: "En ville : bus Va y Ven (carte intelligente), colectivos (fourgonnettes partag\u00e9es pas ch\u00e8res), Uber/DiDi (prix \u00e0 l\u2019avance, id\u00e9al le soir). N\u00e9gociez toujours le tarif du taxi avant de monter. D\u00e9tails : {go:practical}." } },

    { id: "carrental",
      k: { en: ["rent a car", "rental car", "rent car", "driving", "drive"],
           es: ["rentar auto", "renta de auto", "alquiler de coche", "alquilar coche", "manejar", "conducir"],
           fr: ["louer une voiture", "location de voiture", "louer voiture", "conduire"] },
      t: { en: "Rent a car for cenote-hopping days and ruin routes (Uxmal, Chich\u00e9n Itz\u00e1) \u2014 Centro itself is walkable. {aff:localrent|carA} {disc} \u00b7 {aff:getrent|carB} {disc}. Driving tips: {go:practical}.",
           es: "Renta un auto para d\u00edas de cenotes y rutas de ruinas (Uxmal, Chich\u00e9n Itz\u00e1) \u2014 el Centro se camina. {aff:localrent|carA} {disc} \u00b7 {aff:getrent|carB} {disc}. Consejos: {go:practical}.",
           fr: "Louez une voiture pour les journ\u00e9es c\u00e9notes et les routes des ruines (Uxmal, Chich\u00e9n Itz\u00e1) \u2014 le Centro se fait \u00e0 pied. {aff:localrent|carA} {disc} \u00b7 {aff:getrent|carB} {disc}. Conseils : {go:practical}." } },

    { id: "esim",
      k: { en: ["esim", "sim card", "data", "internet", "wifi", "phone", "connected"],
           es: ["esim", "chip", "datos", "internet", "wifi", "telefono", "celular"],
           fr: ["esim", "carte sim", "donnees", "internet", "wifi", "telephone"] },
      t: { en: "Grab a Mexico eSIM before you land so you have data at the airport: {aff:airalo|esim} {disc}. More practical tips: {go:practical}.",
           es: "Compra una eSIM de M\u00e9xico antes de aterrizar y tendr\u00e1s datos en el aeropuerto: {aff:airalo|esim} {disc}. M\u00e1s consejos: {go:practical}.",
           fr: "Prenez une eSIM Mexique avant d\u2019atterrir pour avoir des donn\u00e9es d\u00e8s l\u2019a\u00e9roport : {aff:airalo|esim} {disc}. Plus de conseils : {go:practical}." } },

    { id: "safety",
      k: { en: ["safe", "safety", "dangerous", "crime", "secure"],
           es: ["seguro", "seguridad", "peligroso", "peligro", "delincuencia"],
           fr: ["sur", "securite", "dangereux", "danger", "criminalite"] },
      t: { en: "M\u00e9rida is one of Mexico's safest cities \u2014 normal precautions apply: use Uber/DiDi late at night, agree taxi fares upfront, keep valuables out of sight at markets. More: {go:practical}.",
           es: "M\u00e9rida es una de las ciudades m\u00e1s seguras de M\u00e9xico \u2014 precauciones normales: usa Uber/DiDi de noche, acuerda tarifas de taxi por adelantado. M\u00e1s: {go:practical}.",
           fr: "M\u00e9rida est l\u2019une des villes les plus s\u00fbres du Mexique \u2014 pr\u00e9cautions habituelles : Uber/DiDi le soir, tarif du taxi n\u00e9goci\u00e9 \u00e0 l\u2019avance. Plus : {go:practical}." } },

    { id: "weather",
      k: { en: ["weather", "when to visit", "best time", "rain", "rainy", "hurricane", "hot", "climate", "season"],
           es: ["clima", "cuando visitar", "mejor epoca", "lluvia", "huracan", "calor", "temporada"],
           fr: ["meteo", "quand visiter", "meilleure periode", "pluie", "ouragan", "chaleur", "climat", "saison"] },
      t: { en: "Nov\u2013Mar is the sweet spot: warm and dry. Apr\u2013May is hottest; Jun\u2013Oct brings afternoon showers. Hurricane season peaks Aug\u2013Oct but direct hits are rare. More: {go:tips}.",
           es: "Nov\u2013Mar es ideal: c\u00e1lido y seco. Abr\u2013May es lo m\u00e1s caluroso; Jun\u2013Oct trae lluvias de tarde. La temporada de huracanes es Ago\u2013Oct, pero los impactos directos son raros. M\u00e1s: {go:tips}.",
           fr: "Nov\u2013mar : la p\u00e9riode id\u00e9ale, chaude et s\u00e8che. Avr\u2013mai : le plus chaud ; juin\u2013oct : averses l\u2019apr\u00e8s-midi. Saison des ouragans ao\u00fbt\u2013oct, impacts directs rares. Plus : {go:tips}." } },

    { id: "beach",
      k: { en: ["beach", "progreso", "celestun", "flamingo", "sea", "coast"],
           es: ["playa", "progreso", "celestun", "flamenco", "mar", "costa"],
           fr: ["plage", "progreso", "celestun", "flamant", "mer", "cote"] },
      t: { en: "Progreso is 30 min north for an easy beach day; Celest\u00fan for flamingos + biosphere reserve: {aff:vCelestun|celTour} {disc}. All day trips: {go:daytrips}.",
           es: "Progreso est\u00e1 a 30 min al norte para un d\u00eda de playa; Celest\u00fan para flamencos y la reserva: {aff:vCelestun|celTour} {disc}. Excursiones: {go:daytrips}.",
           fr: "Progreso \u00e0 30 min au nord pour la plage ; Celest\u00fan pour les flamants et la r\u00e9serve : {aff:vCelestun|celTour} {disc}. Excursions : {go:daytrips}." } },

    { id: "freeevents",
      k: { en: ["free", "events", "festival", "things to do", "nightlife", "serenata", "noche mexicana"],
           es: ["gratis", "eventos", "festival", "que hacer", "vida nocturna", "serenata", "noche mexicana"],
           fr: ["gratuit", "evenements", "festival", "a faire", "vie nocturne", "serenata"] },
      t: { en: "M\u00e9rida has free events weekly \u2014 Serenata Yucateca (Thu), Noche Mexicana (Sat), Pok Ta Pok ball game. Calendar: {go:freeevents}.",
           es: "M\u00e9rida tiene eventos gratuitos cada semana \u2014 Serenata Yucateca (jue), Noche Mexicana (s\u00e1b), juego de Pok Ta Pok. Calendario: {go:freeevents}.",
           fr: "M\u00e9rida propose des \u00e9v\u00e9nements gratuits chaque semaine \u2014 Serenata Yucateca (jeu), Noche Mexicana (sam), jeu de balle Pok Ta Pok. Calendrier : {go:freeevents}." } },

    { id: "tours",
      k: { en: ["tour", "guided", "excursion", "day trip"],
           es: ["tour", "guiado", "excursion", "excursi\u00f3n"],
           fr: ["visite", "guidee", "excursion"] },
      t: { en: "Top guided picks: Chich\u00e9n Itz\u00e1 {aff:vChichen|chichenTour}, Uxmal {aff:vUxmal|uxmalTour}, Santa B\u00e1rbara cenotes {aff:vSB|sbTour} {disc}. Compare all: {go:tours}.",
           es: "Los mejores tours: Chich\u00e9n Itz\u00e1 {aff:vChichen|chichenTour}, Uxmal {aff:vUxmal|uxmalTour}, cenotes Santa B\u00e1rbara {aff:vSB|sbTour} {disc}. Compara todos: {go:tours}.",
           fr: "Nos excursions pr\u00e9f\u00e9r\u00e9es : Chich\u00e9n Itz\u00e1 {aff:vChichen|chichenTour}, Uxmal {aff:vUxmal|uxmalTour}, c\u00e9notes Santa B\u00e1rbara {aff:vSB|sbTour} {disc}. Comparez : {go:tours}." } },

    { id: "audiotour",
      k: { en: ["audio", "self-guided", "walk", "walking tour"],
           es: ["audio", "autoguiado", "caminar", "caminata"],
           fr: ["audio", "autoguide", "marcher", "promenade"] },
      t: { en: "Prefer exploring solo? The \u201cM\u00e9rida: Mysteries Unveiled\u201d self-guided audio tour (\u20ac10) is excellent: {aff:wegotrip|audioTour} {disc}",
           es: "\u00bfPrefieres explorar por tu cuenta? El audiotour \u201cM\u00e9rida: Mysteries Unveiled\u201d (\u20ac10) es excelente: {aff:wegotrip|audioTour} {disc}",
           fr: "Vous pr\u00e9f\u00e9rez explorer seul ? La visite audio \u00ab M\u00e9rida: Mysteries Unveiled \u00bb (10 \u20ac) est excellente : {aff:wegotrip|audioTour} {disc}" } },

    { id: "thanks",
      k: { en: ["thank", "thanks", "great", "awesome", "perfect"],
           es: ["gracias", "genial", "perfecto", "excelente"],
           fr: ["merci", "genial", "parfait", "excellent"] },
      t: { en: "You're welcome! Enjoy M\u00e9rida \ud83c\udf35 Want weekly tips? {nl:newsletter}.",
           es: "\u00a1Con gusto! Disfruta M\u00e9rida \ud83c\udf35 \u00bfQuieres consejos semanales? {nl:newsletter}.",
           fr: "Avec plaisir ! Profitez bien de M\u00e9rida \ud83c\udf35 Des conseils hebdo ? {nl:newsletter}." } }
  ];

  var FALLBACK = {
    en: "I can help with cenotes, ruins, food, hotels, transport, beaches and free events \u2014 or grab the {go:guide}.",
    es: "Puedo ayudarte con cenotes, ruinas, comida, hoteles, transporte, playas y eventos gratuitos \u2014 o descarga la {go:guide}.",
    fr: "Je peux vous aider pour les c\u00e9notes, les ruines, la gastronomie, les h\u00f4tels, les transports, les plages et les \u00e9v\u00e9nements gratuits \u2014 ou t\u00e9l\u00e9chargez le {go:guide}."
  };
  var NUDGE = {
    en: "Psst \u2014 want weekly M\u00e9rida tips in your inbox? Join {nl:newsletter} (free).",
    es: "Psst \u2014 \u00bfquieres consejos semanales de M\u00e9rida? \u00danete a {nl:newsletter} (gratis).",
    fr: "Psst \u2014 des conseils hebdo sur M\u00e9rida par e-mail ? Recevez {nl:newsletter} (gratuit)."
  };
  var QUICK = {
    en: ["Best cenotes", "Airport transfer", "Free guide \ud83c\udf81", "Day trips"],
    es: ["Mejores cenotes", "Traslado aeropuerto", "Gu\u00eda gratis \ud83c\udf81", "Excursiones"],
    fr: ["Top c\u00e9notes", "Transfert a\u00e9roport", "Guide gratuit \ud83c\udf81", "Excursions"]
  };
  var UI = {
    title: { en: "Visit M\u00e9rida Assistant", es: "Asistente Visit M\u00e9rida", fr: "Assistant Visit M\u00e9rida" },
    online: { en: "Ask about cenotes, ruins, food\u2026", es: "Pregunta sobre cenotes, ruinas, comida\u2026", fr: "Questions sur c\u00e9notes, ruines, gastronomie\u2026" },
    ph: { en: "Type your question\u2026", es: "Escribe tu pregunta\u2026", fr: "\u00c9crivez votre question\u2026" }
  };

  /* ---------- matching ---------- */
  function fold(s) {
    return (s || "").toLowerCase()
      .replace(/[\u00e0\u00e1\u00e2\u00e3\u00e4\u00e5]/g, "a").replace(/[\u00e8\u00e9\u00ea\u00eb]/g, "e")
      .replace(/[\u00ec\u00ed\u00ee\u00ef]/g, "i").replace(/[\u00f2\u00f3\u00f4\u00f5\u00f6]/g, "o")
      .replace(/[\u00f9\u00fa\u00fb\u00fc]/g, "u").replace(/\u00f1/g, "n").replace(/\u00e7/g, "c");
  }
  function match(q) {
    var fq = " " + fold(q) + " ", best = null, bestScore = 0;
    for (var i = 0; i < KB.length; i++) {
      var kws = KB[i].k[LANG] || KB[i].k.en, score = 0;
      for (var j = 0; j < kws.length; j++) {
        if (fq.indexOf(fold(kws[j])) !== -1) score += kws[j].length; // longer keyword = stronger
      }
      if (score > bestScore) { bestScore = score; best = KB[i]; }
    }
    return best;
  }

  /* ---------- render tokens ---------- */
  function render(tpl) {
    return tpl
      .replace(/\{disc\}/g, DISC[LANG])
      .replace(/\{aff:([a-zA-Z0-9]+)\|([a-zA-Z]+)\}/g, function (m, name, lbl) {
        return a(AFF[name], LBL[lbl][LANG]);
      })
      .replace(/\{go:([a-z]+)\}/g, function (m, base) {
        var label = { en: "guide", es: "gu\u00eda", fr: "guide" }[LANG];
        var pageNames = { guide: label, cenotes: "cenotes", daytrips: "day trips", food: "food guide",
                          practical: "practical guide", tips: "tips", tours: "tours", freeevents: "free events" };
        return go(base, pageNames[base] === label ? LBL.guide[LANG] : (pageNames[base] || base));
      })
      .replace(/\{nl:([a-z]+)\}/g, function (m, lbl) { return a(FOLLOW.nl, LBL.newsletter[LANG]); })
      .replace(/\{soc:ig\}/g, a(FOLLOW.ig, "Instagram"))
      .replace(/\{soc:fb\}/g, a(FOLLOW.fb, "Facebook group"))
      .replace(/\{soc:th\}/g, a(FOLLOW.th, "Threads"));
  }

  /* ---------- widget ---------- */
  var CSS = [
    "#vm-bot-btn{position:fixed;bottom:18px;right:18px;width:58px;height:58px;border-radius:50%;",
    "background:linear-gradient(135deg,#0d9488,#f59e0b);border:none;cursor:pointer;z-index:99990;",
    "box-shadow:0 4px 16px rgba(0,0,0,.3);font-size:26px;color:#fff;display:flex;align-items:center;justify-content:center}",
    "#vm-bot-btn:hover{transform:scale(1.06)}",
    "#vm-bot-panel{position:fixed;bottom:88px;right:18px;width:370px;max-width:calc(100vw - 36px);",
    "height:500px;max-height:calc(100vh - 120px);background:#fff;border-radius:16px;z-index:99991;display:none;",
    "flex-direction:column;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,.28);font-family:system-ui,-apple-system,sans-serif}",
    "#vm-bot-panel.vm-open{display:flex}",
    "#vm-bot-head{background:linear-gradient(135deg,#0d9488,#0f766e);color:#fff;padding:12px 14px;display:flex;align-items:center;gap:10px}",
    "#vm-bot-head .vm-ava{width:34px;height:34px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;font-size:18px}",
    "#vm-bot-head .vm-tt{flex:1}#vm-bot-head .vm-tt b{display:block;font-size:14px}#vm-bot-head .vm-tt span{font-size:11px;opacity:.85}",
    "#vm-bot-x{background:none;border:none;color:#fff;font-size:20px;cursor:pointer;line-height:1}",
    "#vm-bot-msgs{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px;background:#f8fafc}",
    ".vm-m{max-width:85%;padding:9px 12px;border-radius:14px;font-size:13.5px;line-height:1.45;word-wrap:break-word}",
    ".vm-bot{background:#fff;border:1px solid #e2e8f0;border-bottom-left-radius:4px;align-self:flex-start;color:#1e293b}",
    ".vm-bot a{color:#0d9488;font-weight:600}",
    ".vm-user{background:#0d9488;color:#fff;border-bottom-right-radius:4px;align-self:flex-end}",
    ".vm-typing{color:#94a3b8;font-style:italic;font-size:12px;align-self:flex-start}",
    "#vm-bot-quick{display:flex;gap:6px;padding:8px 12px;flex-wrap:wrap;background:#f8fafc;border-top:1px solid #e2e8f0}",
    ".vm-q{background:#fff;border:1px solid #0d9488;color:#0d9488;border-radius:20px;padding:5px 11px;font-size:12px;cursor:pointer}",
    ".vm-q:hover{background:#0d9488;color:#fff}",
    "#vm-bot-in{display:flex;border-top:1px solid #e2e8f0;padding:8px;background:#fff}",
    "#vm-bot-in input{flex:1;border:1px solid #e2e8f0;border-radius:20px;padding:8px 14px;font-size:13px;outline:none}",
    "#vm-bot-in button{background:#0d9488;color:#fff;border:none;border-radius:20px;padding:8px 16px;margin-left:6px;cursor:pointer;font-size:13px;font-weight:600}"
  ].join("\n");

  var style = document.createElement("style");
  style.textContent = CSS;
  document.head.appendChild(style);

  var btn = document.createElement("button");
  btn.id = "vm-bot-btn";
  btn.setAttribute("aria-label", "Chat");
  btn.innerHTML = "\ud83d\udcac";
  document.body.appendChild(btn);

  var panel = document.createElement("div");
  panel.id = "vm-bot-panel";
  panel.innerHTML =
    '<div id="vm-bot-head"><div class="vm-ava">\ud83c\udf35</div>' +
    '<div class="vm-tt"><b>' + UI.title[LANG] + "</b><span>" + UI.online[LANG] + "</span></div>" +
    '<button id="vm-bot-x" aria-label="Close">\u00d7</button></div>' +
    '<div id="vm-bot-msgs"></div><div id="vm-bot-quick"></div>' +
    '<div id="vm-bot-in"><input id="vm-bot-text" maxlength="300" placeholder="' + UI.ph[LANG] + '">' +
    "<button id=\"vm-bot-send\">&#10148;</button></div>";
  document.body.appendChild(panel);

  var msgs = panel.querySelector("#vm-bot-msgs");
  var quick = panel.querySelector("#vm-bot-quick");
  var input = panel.querySelector("#vm-bot-text");
  var opened = false, answers = 0, nudged = false;

  function scroll() { msgs.scrollTop = msgs.scrollHeight; }
  function botSay(html) {
    var d = document.createElement("div");
    d.className = "vm-m vm-bot";
    d.innerHTML = html;
    msgs.appendChild(d); scroll();
  }
  function userSay(text) {
    var d = document.createElement("div");
    d.className = "vm-m vm-user";
    d.textContent = text;
    msgs.appendChild(d); scroll();
  }
  function showQuick() {
    quick.innerHTML = "";
    QUICK[LANG].forEach(function (q) {
      var b = document.createElement("button");
      b.className = "vm-q"; b.textContent = q;
      b.onclick = function () { ask(q); };
      quick.appendChild(b);
    });
  }
  function ask(text) {
    var q = (text || "").trim();
    if (!q) return;
    userSay(q);
    input.value = "";
    var tp = document.createElement("div");
    tp.className = "vm-typing"; tp.textContent = "\u2026";
    msgs.appendChild(tp); scroll();
    setTimeout(function () {
      tp.remove();
      var intent = match(q);
      var tpl = intent ? intent.t[LANG] : FALLBACK[LANG];
      botSay(render(tpl));
      answers++;
      if (answers >= 2 && !nudged) { nudged = true; botSay(render(NUDGE[LANG])); }
    }, 550);
  }

  btn.onclick = function () {
    panel.classList.toggle("vm-open");
    if (!opened) {
      opened = true;
      var g = match("hello");
      botSay(render(g.t[LANG]));
      showQuick();
    }
  };
  panel.querySelector("#vm-bot-x").onclick = function () { panel.classList.remove("vm-open"); };
  panel.querySelector("#vm-bot-send").onclick = function () { ask(input.value); };
  input.addEventListener("keydown", function (e) { if (e.key === "Enter") ask(input.value); });
})();
