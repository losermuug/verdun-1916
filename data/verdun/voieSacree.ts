export interface VoieSacreePoint {
  lat: number;
  lng: number;
  altitude?: number;
  name: string;
  frenchName: string;
  km: number;
  note: string;
  isMajorStop?: boolean;
}

export const VOIE_SACREE_ROUTE_POINTS: VoieSacreePoint[] = [
  {
    lat: 48.77361,
    lng: 5.16111,
    altitude: 180,
    name: "Бар-ле-Дюк (Эхлэл цэг)",
    frenchName: "Bar-le-Duc (Borne 0)",
    km: 0,
    note: "«Ариун зам»-ын 0 км. Францын төмөр замын сүлжээнээс ачаа, цэргүүдийг машинд ачих ложистикийн гол бааз.",
    isMajorStop: true,
  },
  {
    lat: 48.7961,
    lng: 5.2153,
    altitude: 210,
    name: "Нэв-Розьер",
    frenchName: "Naives-Rosières",
    km: 5.2,
    note: "Цувааны хурд, зайг тохируулах анхны хяналтын цэг.",
  },
  {
    lat: 48.8258,
    lng: 5.2289,
    altitude: 240,
    name: "Рессон",
    frenchName: "Resson",
    km: 9.8,
    note: "Хөдөлгөөнт засварын цуваа.",
  },
  {
    lat: 48.8503,
    lng: 5.2519,
    altitude: 270,
    name: "Эриз-ла-Брюле",
    frenchName: "Érize-la-Brûlée",
    km: 14.5,
    note: "Мотор эвдэрсэн машиныг жалга руу түлхэж зам чөлөөлдөг тусгай анги байрлаж байв.",
    isMajorStop: true,
  },
  {
    lat: 48.8833,
    lng: 5.2547,
    altitude: 290,
    name: "Розн",
    frenchName: "Rosnes",
    km: 19.3,
    note: "Тээврийн тосолгоо, шатахуун хангамжийн цэг.",
  },
  {
    lat: 48.925,
    lng: 5.2583,
    altitude: 310,
    name: "Шомон-сюр-Эр",
    frenchName: "Chaumont-sur-Aire",
    km: 25.1,
    note: "Фронтоос буцах шархагсдыг хүлээн авах хээрийн эмнэлэг ба бааз.",
    isMajorStop: true,
  },
  {
    lat: 48.9833,
    lng: 5.275,
    altitude: 315,
    name: "Хепп",
    frenchName: "Heippes",
    km: 33.4,
    note: "Замыг тасралтгүй засах 700,000 тонн шохойн чулуу буулгах төвлөрсөн бүс.",
  },
  {
    lat: 49.02722,
    lng: 5.28639,
    altitude: 300,
    name: "Суйи (Петений төв штаб)",
    frenchName: "Souilly (QG de la IIe Armée)",
    km: 39.8,
    note: "Генерал Петен (Mairie de Souilly)-ийн төв штаб. «Нориа» систем болон 14 секундын цувааны зохицуулалтыг эндээс удирдсан.",
    isMajorStop: true,
  },
  {
    lat: 49.0683,
    lng: 5.2881,
    altitude: 285,
    name: "Лемм (Дурсгалын цогцолбор)",
    frenchName: "Lemmes (Mémorial de la Voie Sacrée)",
    km: 45.2,
    note: "1967 онд босгосон «Ариун зам»-ын төрийн албан ёсны дурсгалын хөшөөт өндөрлөг.",
    isMajorStop: true,
  },
  {
    lat: 49.0983,
    lng: 5.2833,
    altitude: 260,
    name: "Сенонкур",
    frenchName: "Senoncourt-les-Maujouy",
    km: 49.0,
    note: "Их бууны сум шилжүүлэн ачих сүүлчийн завсрын өртөө.",
  },
  {
    lat: 49.1172,
    lng: 5.3025,
    altitude: 245,
    name: "Никсевиль",
    frenchName: "Nixéville",
    km: 52.8,
    note: "Цэргүүд шуудуу руу орохоор жагсдаг эцсийн хотхон.",
  },
  {
    lat: 49.12389,
    lng: 5.30528,
    altitude: 230,
    name: "Мулен-Брюле (Төгсгөлийн өртөө)",
    frenchName: "Moulin-Brûlé (Terminus de la Voie Sacrée)",
    km: 55.4,
    note: "Berliet CBA ачааны машинууд эргэж, цэргүүд явганаар шуудуу руу хөдөлдөг буулгалтын эцсийн цэг.",
    isMajorStop: true,
  },
  {
    lat: 49.155,
    lng: 5.37,
    altitude: 215,
    name: "Вердун (Цайз / Төв)",
    frenchName: "Verdun (Citadelle / Régret)",
    km: 57.2,
    note: "Вердуны хамгаалалтын төв. Газар доорх цайз ба их бууны гол түшиц.",
    isMajorStop: true,
  },
];

export const VOIE_SACREE_COORDINATES = VOIE_SACREE_ROUTE_POINTS.map((pt) => ({
  lat: pt.lat,
  lng: pt.lng,
  altitude: pt.altitude ?? 20,
}));

export const VOIE_SACREE_STATS = {
  lengthKm: 57.2,
  cadenceSeconds: 14,
  peakCadenceSeconds: 5,
  dailyTrucks: 6000,
  totalSoldiers: 3000000,
  armyPercentage: 75,
  totalMunitionsTons: 2000000,
  gravelUsedTons: 700000,
  primaryVehicle: "Berliet CBA (3.5 тонн)",
};
