import type { PictureRailItem } from "@/components/ui/picture-rail-gallery";
import type { PanelId } from "@/types/exhibition";

export interface VerdunRailExhibit {
  id: string;
  panelId: PanelId;
  hall: "front" | "memorial";
  featured: boolean;
  item: PictureRailItem;
  description: string;
  keyFacts: string[];
  caveat?: string;
  quote?: {
    text: string;
    author: string;
    date: string;
  };
  sourceName: string;
  sourceUrl: string;
  license: string;
}

export const VERDUN_RAIL_EXHIBITS: VerdunRailExhibit[] = [
  {
    id: "asset-verdun-map",
    panelId: "panel-1",
    hall: "front",
    featured: true,
    item: {
      id: "asset-verdun-map",
      title: "Вердуны цүлхэн ба фронтын шугам",
      artist: "Мёз голын бүс",
      year: "1916",
      image: "/archive/battle-of-verdun-map.png",
      aspect: 971 / 628,
      frame: "black",
      mat: true,
      drop: 0.06,
      tag: "1916 · Газрын зураг",
      details: [
        "1916 оны Вердуны цүлхэн",
        "28 бэхлэлт (22 гадаад, 6 дотоод)",
        "«Ариун зам» · 57.2 км гол хангамж",
        "Public Domain / GFDL",
      ],
    },
    description:
      "1916 оны эхээр Вердун гурван талаас Германы галд өртөх цүлхэнд орж, өргөн царигийн төмөр зам нь таслагджээ. Францын арми Бар-ле-Дюкээс Вердун хүрэх 57.2 км «Ариун зам» (La Voie Sacrée)-аар оргил үедээ 5 секунд тутамд (дунджаар 14 секунд тутамд) нэг машин явуулж, 2 сая тонн хангамж, ~4 сая цэрэг зөөвөрлөсөн.",
    keyFacts: [
      "Сэрэ де Ривьер: 28 бэхлэлтийн давхар цайз",
      "Газар доорх цайз: 16 м хадан доор 6,000 хүн, өдөрт 28,000 талх",
      "Засварт 700,000+ тн шохойн чулуу дэвссэн",
    ],
    caveat:
      "Фалькенхайны «Зул сарын санамж бичиг» (Францыг цусаар юүлэх төлөвлөгөө) эх хувиар олдоогүй тул түүхч Хольгер Аффлербах нар маргаантай гэж үздэг.",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Battle_of_Verdun_map.png",
    license: "GFDL",
  },
  {
    id: "asset-defense-forts",
    panelId: "panel-1",
    hall: "front",
    featured: false,
    item: {
      id: "asset-defense-forts",
      title: "Зүүн хойд бэхлэлт: Дуомон ба Во",
      artist: "Хамгаалалтын цагираг",
      year: "1916",
      image: "/archive/defense-verdun-forts.png",
      aspect: 302 / 254,
      frame: "oak",
      mat: true,
      drop: 0.02,
      tag: "Бэхлэлт",
      details: [
        "Дуомон ба Во цайзууд",
        "1915 онд их бууг нь шилжүүлснээр суларсан",
        "CC BY-SA",
      ],
    },
    description:
      "1870 оны дайны дараа хотыг тойруулан 8 км радиуст 22 гадаад, 6 дотоод бэхлэлт барьсан. 1914 онд Бельгийн Льежийн цайзууд унасны дараа 1915 онд Вердуны зөөврийн их бууг өөр фронт руу татсанаар 1916 оны 2 дугаар сард эдгээр цайз хамгаалалт султай угтжээ.",
    keyFacts: [
      "1915 он: Зөөврийн их буу ба сумыг өөр фронт руу татсан",
      "Нарийн царигийн «Мёзьен» төмөр зам нэмэлт шугам болов",
    ],
    sourceName: "Wikimedia Commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:D%C3%A9fense_de_Verdun_-_forts_de_Vaux_et_de_Douaumont.png",
    license: "CC BY-SA",
  },
  {
    id: "asset-douaumont-aerial",
    panelId: "panel-1",
    hall: "front",
    featured: true,
    item: {
      id: "asset-douaumont-aerial",
      title: "Дуомоны бэхлэлтийн агаарын зураг",
      artist: "Агаарын тагнуул",
      year: "1916",
      image: "/archive/douaumont-fort-1916-aerial.jpg",
      aspect: 1280 / 960,
      frame: "oak",
      drop: -0.02,
      tag: "1916.02.25",
      details: [
        "1916.02.21 · 1,200 их бууны гал нээв",
        "1916.02.25 · Герман эзлэв",
        "Public Domain",
      ],
    },
    description:
      "1916 оны 2 дугаар сарын 21-ний 07:15 цагт Герман 1,200 их бууны «бөмбөрийн гал» (Trommelfeuer) нээж, дөрөв хоногийн дараа буюу 2 дугаар сарын 25-нд хамгаалалт цөөн байсан Дуомоны бэхлэлтийг эзэлснээр Францын арми хүнд хямралд орсон.",
    keyFacts: [
      "Эхний өдөр: 350,000–1,000,000 их бууны сум харвасан",
      "Дуомон 8 сар Германы гол түшиц байв",
    ],
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Douaumontfort.jpg",
    license: "Public Domain",
  },
  {
    id: "asset-fort-douaumont-ende-1916",
    panelId: "panel-2",
    hall: "front",
    featured: true,
    item: {
      id: "asset-fort-douaumont-ende-1916",
      title: "Бөмбөгдөлтөд сүйрсэн Дуомон",
      artist: "Дуомон цайз",
      year: "1916 оны сүүлч",
      image: "/archive/fort-douaumont-ende-1916.jpg",
      aspect: 1280 / 1188,
      frame: "black",
      mat: true,
      drop: 0.14,
      tag: "302 хоног",
      details: [
        "1916.02.21 – 12.18 · 302 хоног",
        "40–60 сая нийт сум (урьдчилсан тойм)",
        "Нийт хохирол: 700,000+ хүн",
        "Public Domain",
      ],
    },
    description:
      "302 хоногийн тулалдаанд (уламжлалаар «300 өдөр, 300 шөнө») Герман дангаараа 23 сая, хоёр тал нийлээд 40–60 сая сум харвасан гэж тооцоолдог. Нийт хохирол 700,000 гаруй хүнд хүрсэн ч фронт анхны шугамдаа шахуу эргэж тогтсон.",
    keyFacts: [
      "Өдөрт дунджаар 132,450–198,675 сум (минут тутамд 92–138)",
      "Нийт хохирлын 70–95% нь их бууны хэлтэрхийнд өртсөн",
    ],
    quote: {
      text: "Хүн төрөлхтөн галзуурчээ... Там ч ийм аймшигтай байх боломжгүй.",
      author: "Дэслэгч Альфред Жубер",
      date: "1916.05.23",
    },
    caveat:
      "Тооцооллын зөрүү: Мемориал музей 700,000+, У.Филпотт 714,000 (Франц 377,000, Герман 337,000), Британника ~750,000.",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Fort_Douaumont_Ende_1916.jpg",
    license: "Public Domain",
  },
  {
    id: "asset-mort-homme-map",
    panelId: "panel-2",
    hall: "front",
    featured: true,
    item: {
      id: "asset-mort-homme-map",
      title: "Морт-Омм ба 304-р өндөрлөг",
      artist: "Өрнөд эргийн фронт",
      year: "1917",
      image: "/archive/mort-homme-cote-304-1917.png",
      aspect: 860 / 499,
      frame: "oak",
      drop: 0.04,
      tag: "«Нориа» · Улаан бүс",
      details: [
        "1916 оны хаврын тулаан",
        "Флери тосгон 16 удаа гараас гарт орсон",
        "Дайны дараа 1,200 км² «Улаан бүс» тогтоов",
        "Public Domain",
      ],
    },
    description:
      "1916 оны 3 дугаар сараас тулаан Мёз голын өрнөд эрэгт шилжиж, 304-р өндөрлөгийн оргил их бууны галд 10 метрээр намссан гэдэг. Генерал Петен ангиудыг ээлжлэн амраах «нориа» систем нэвтрүүлж, Францын армийн 3/4 (75 дивиз) энд дамжжээ.",
    keyFacts: [
      "1916.06.23: Нивеллийн тушаал «Тэд нэвтэрч чадахгүй!»",
      "9 тосгон бүрэн сүйрч, 6 нь өнөөдөр хүнгүй хэвээр",
    ],
    sourceName: "Wikimedia Commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Mort_Homme_and_Cote_304,_Verdun,_1917.png",
    license: "Public Domain",
  },
  {
    id: "asset-reprise-douaumont",
    panelId: "panel-2",
    hall: "front",
    featured: true,
    item: {
      id: "asset-reprise-douaumont",
      title: "Дуомоныг эргүүлэн авсан нь",
      artist: "Анри-Жорж Шартье",
      year: "1916.10.24",
      image: "/archive/reprise-douaumont-painting.png",
      aspect: 1280 / 997,
      frame: "white",
      mat: true,
      drop: 0.1,
      tag: "1916.10.24",
      details: [
        "Зураач: Henri-Georges Chartier",
        "Генерал Манжены сөрөг довтолгоо",
        "400 мм их буу, «мөлхөгч гал» тактик",
        "Public Domain",
      ],
    },
    description:
      "7 дугаар сарын 1-нд Соммын тулалдаан эхэлснээр Германы хүч сарнисан. Намар нь генерал Нивелль, Манжен нар «мөлхөгч гал» болон 400 мм хүнд их буугаар 10 дугаар сарын 24-нд Дуомоныг, 11 дүгээр сарын 2-нд Во цайзыг эргүүлэн авсан.",
    keyFacts: [
      "1916.07.01: Соммын тулалдаан дарамтыг сулруулав",
      "1916.11.02: Во бэхлэлт Францын мэдэлд эргэн ирэв",
    ],
    sourceName: "Wikimedia Commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:La_reprise_de_Douaumont,_le_24_octobre_1916.PNG",
    license: "Public Domain",
  },
  {
    id: "asset-ossuaire-postcard",
    panelId: "panel-4",
    hall: "memorial",
    featured: true,
    item: {
      id: "asset-ossuaire-postcard",
      title: "Дуомоны Яс Хадгалах Бунхан",
      artist: "Хамба лам Шарль Жинисти",
      year: "1920–1932",
      image: "/archive/ossuaire-historical-postcard.jpg",
      aspect: 1280 / 797,
      frame: "oak",
      mat: true,
      drop: 0,
      tag: "ЮНЕСКО 2023",
      details: [
        "46 м цамхаг · 137 м урт хонгил",
        "130,000 танигдаагүй Франц, Герман цэрэг",
        "2023 · ЮНЕСКО-гийн Дэлхийн өв",
        "Public Domain түүхэн ил захидал",
      ],
    },
    description:
      "1920–1932 онд баригдсан Дуомоны Яс Хадгалах Бунхны 137 метр хонгилд Франц, Германы танигдаагүй 130,000 цэргийн шарилыг хамтад нь хадгалдаг. 2023 онд бунхан, Дуомон бэхлэлт, Жадын шуудуу ЮНЕСКО-гийн Дэлхийн өвд бүртгэгджээ.",
    keyFacts: [
      "1920.11.10: Газар доорх цайзад «Үл танигдах цэрэг»-ийг сонгов",
      "Жадын шуудуу малтлага: 21 цогцос (14 танигдсан, 7 үлдсэн)",
    ],
    caveat:
      "Барилгын архитектурын зохиогчийн эрхийг хүндэтгэн зөвхөн түүхэн ил захидал ба de minimis зураг ашиглав.",
    sourceName: "Wikimedia Commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Ossuaire_de_Douaumont,_Verdun_1914-1918_P-FG-CP-01050-13.jpg",
    license: "Public Domain",
  },
  {
    id: "asset-ossuary-cemetery-deminimis",
    panelId: "panel-5",
    hall: "memorial",
    featured: true,
    item: {
      id: "asset-ossuary-cemetery-deminimis",
      title: "Үндэсний оршуулга ба Эвлэрлийн талбай",
      artist: "Дуомон",
      year: "1984 / 2016",
      image: "/archive/ossuary-cemetery-view.jpg",
      aspect: 1200 / 900,
      frame: "black",
      drop: 0.08,
      tag: "Энхийн сургамж",
      details: [
        "16,142 булш (592 лал хөшөө, еврей дурсгал)",
        "1984.09.22 · Миттеран, Коль гар атгалцав",
        "2016.05.29 · Олланд, Меркель (3,500 залуус)",
        "CC BY (De minimis)",
      ],
    },
    description:
      "1984 оны 9 дүгээр сарын 22-нд Францын Ерөнхийлөгч Ф.Миттеран, Германы Канцлер Г.Коль нар энд гар гараасаа атгалцан зогссон нь Франц-Германы эвлэрлийн бэлгэдэл болов. 2016 онд Ф.Олланд, А.Меркель нар 3,500 залуусын хамт Европын энх тайвныг сануулсан юм.",
    keyFacts: [
      "Сургамж 1: Элэгдлийн дайнд ялагч үгүй (700,000+ хохирол)",
      "Сургамж 2: Хоёр талын эн тэнцүү ой санамж өшөөг анагаана",
      "Сургамж 3: Зэвсгийн хордлого 300–700 жил хадгалагдана",
    ],
    quote: {
      text: "Бид эвлэрсэн. Бид бие биенээ ойлгосон. Бид найзууд болсон.",
      author: "Франсуа Миттеран, Гельмут Коль",
      date: "1984.09.22",
    },
    sourceName: "Wikimedia Commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Ossuary_of_Douaumont_(Verdun,_France_2013)_(9124638286).jpg",
    license: "CC BY (De minimis)",
  },
  {
    id: "asset-ossuaire-tower-view",
    panelId: "panel-4",
    hall: "memorial",
    featured: false,
    item: {
      id: "asset-ossuaire-tower-view",
      title: "Үндэсний оршуулгын талбай",
      artist: "Цамхгаас харагдах төрх",
      year: "2005",
      image: "/archive/ossuaire-cemetery-tower-view.jpg",
      aspect: 1280 / 960,
      frame: "oak",
      drop: 0.04,
      tag: "14.438 га",
      details: [
        "14.438 га талбайтай цэргийн оршуулга",
        "16,142 булш (WWII-ийн 6 булш багтсан)",
        "CC BY-SA",
      ],
    },
    description:
      "14.438 га талбай бүхий Үндэсний оршуулгын газарт 16,142 булш, Мекка зүгт чиглүүлсэн лал цэргүүдийн 592 чулуун хөшөө, 1938 оны еврей цэргүүдийн дурсгал оршдог.",
    keyFacts: [
      "1967 он: Флери буурин дээр Вердуны Мемориал нээгдэв",
      "2016 он: Хоёр талын түүхийг тэнцүү өгүүлэхээр шинэчлэгдсэн",
    ],
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Verdun_-_Ossuaire_Douamont_04.jpg",
    license: "CC BY-SA",
  },
  {
    id: "asset-ossuaire-german-mg",
    panelId: "panel-4",
    hall: "memorial",
    featured: false,
    item: {
      id: "asset-ossuaire-german-mg",
      title: "Дэлхийн I дайны Герман пулемёт",
      artist: "Цамхгийн музейн үзмэр",
      year: "1916",
      image: "/archive/ossuaire-german-mg.jpg",
      aspect: 1280 / 960,
      frame: "black",
      mat: true,
      drop: 0.12,
      tag: "Олдвор",
      details: [
        "Германы 50 орчим дивиз оролцсон",
        "Францын 75 дивиз оролцсон",
        "CC BY-SA",
      ],
    },
    description:
      "Бунхны цамхгийн музей дахь Дэлхийн I дайны Герман пулемёт. Орчин үеийн Вердуны музей болон 1994 онд нээгдсэн Дэлхийн энх тайвны төв нь дайныг Франц, Германы хоёр талын нүдээр өгүүлдэг.",
    keyFacts: [
      "Франц 75 дивиз (армийн 3/4), Герман ~50 дивиз тулалдсан",
      "Жил бүр 140,000+ хүн Мемориал музейд зочилдог",
    ],
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Verdun_-_Ossuaire_Douamont_01.jpg",
    license: "CC BY-SA",
  },
  {
    id: "asset-ossuaire-cimetiere-1a",
    panelId: "panel-4",
    hall: "memorial",
    featured: false,
    item: {
      id: "asset-ossuaire-cimetiere-1a",
      title: "Дуомоны бунхан ба оршуулгын цогцолбор",
      artist: "Дуомон",
      year: "Түүхэн зураг",
      image: "/archive/ossuaire-et-cimetiere-1a.jpg",
      aspect: 1280 / 811,
      frame: "white",
      mat: true,
      drop: 0.02,
      tag: "Дурсгал",
      details: [
        "130,000 үл танигдах + 16,142 булш",
        "Вердун хотод 2,305 барилга сүйрсэн",
        "CC BY-SA",
      ],
    },
    description:
      "Дайны дараа 2,305 орон сууцны барилга сүйрсэн Вердун нь 26 одон медальтай Францын хамгийн олон шагналтай хот болж, Дуомоны цогцолбор энх тайвны мөнхийн сануулга болон үлджээ.",
    keyFacts: [
      "1919 он: «Хохирогчдын харти» хуулиар Улаан бүсийг төрийн мэдэлд авсан",
      "Place à Gaz: 1 кг хөрсөнд 176 г хүнцэл илэрсэн",
    ],
    sourceName: "Wikimedia Commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Verdun,_Douaumont,_Ossuaire_et_cimeti%C3%A8re_(1A).jpg",
    license: "CC BY-SA",
  },
];
