import type { TimelineEvent } from "@/types/exhibition";

export const VERDUN_TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: "evt-feb-21",
    dateRange: "2-р сарын 21–22",
    monthIndex: 2,
    phase: "assault",
    phaseLabel: "Нээлтийн гал ба эхний цохилт",
    title: "Германы довтолгоо ба Корын ой (Bois des Caures)",
    significance:
      "07:15 цагт ~1,200 их бууны «бөмбөрийн гал» (Trommelfeuer) эхэлж, нүргээн 160 км алс Вогезийн уулсаас сонсогдов. Дэд хурандаа Эмиль Дриан амь үрэгдэж, 1,200 анчнаас 100–110 орчим хүн л амьд үлдэв.",
    locationId: "battle-center",
    sourceRef: 2,
  },
  {
    id: "evt-feb-25",
    dateRange: "2-р сарын 25",
    monthIndex: 2,
    phase: "assault",
    phaseLabel: "Нээлтийн гал ба эхний цохилт",
    title: "Дуомоны бэхлэлт унаж, Петен томилогдов",
    significance:
      "Зөвхөн 56 бэлтгэл цэрэгтэй байсан Дуомоны бэхлэлтийг Герман эзэлж, генерал Филипп Петен 2-р армийн хамгаалалтыг авч «нориа» ээлжийн тогтолцоог нэвтрүүлэв.",
    locationId: "fort-douaumont",
    sourceRef: 2,
  },
  {
    id: "evt-mar-may",
    dateRange: "3-р сарын 6 – 5-р сарын 7",
    monthIndex: 3,
    phase: "attrition",
    phaseLabel: "Өрнөд эргийн элэгдлийн тулаан",
    title: "Мёз голын зүүн (өрнөд) эргийн тулалдаан",
    significance:
      "Морт-Омм, 304-р өндөрлөгт ширүүн тулаан өрнөж, 5-р сарын 3-нд 500 хүнд их буу утааг 800 м өндөрт хөөргөв. 4-р сарын 10-нд Петен «Зоригтой бай, бид тэднийг дийлнэ!» тушаалаа өгчээ.",
    locationId: "mort-homme",
    sourceRef: 2,
  },
  {
    id: "evt-may-8",
    dateRange: "5-р сарын 8",
    monthIndex: 5,
    phase: "attrition",
    phaseLabel: "Өрнөд эргийн элэгдлийн тулаан",
    title: "Дуомоны бэхлэлтийн доторх дэлбэрэлт",
    significance:
      "Бэхлэлтийн доторх сум, гранат, галын шингэний агуулах дэлбэрч, 679 Герман цэрэг түлэгдэж, амьсгал боогдож амь үрэгдэв.",
    locationId: "fort-douaumont",
    sourceRef: 2,
  },
  {
    id: "evt-jun-1",
    dateRange: "6-р сарын 1–7",
    monthIndex: 6,
    phase: "crisis",
    phaseLabel: "Зуны оргил хямрал",
    title: "Во бэхлэлтийн бүслэлт",
    significance:
      "Командлагч Рейналын 600 гаруй цэрэг хонгил бүрд тулалдсаны эцэст усгүй болж бууж өгөв (250–500 гаруй цэрэг олзлогдсон).",
    locationId: "fort-vaux",
    sourceRef: 17,
  },
  {
    id: "evt-jun-20",
    dateRange: "6-р сарын 20–23",
    monthIndex: 6,
    phase: "crisis",
    phaseLabel: "Зуны оргил хямрал",
    title: "Хийн довтолгоо ба Флери тосгоны хямрал",
    significance:
      "2,000 орчим их буу 100,000 шахам хийн сум харваж, Флери тосгоныг эзэлсэн ч Фруадтеррт зогсоов. Генерал Робер Нивелль «Тэд нэвтэрч чадахгүй!» тушаал гаргав.",
    locationId: "fleury-devant-douaumont",
    sourceRef: 2,
  },
  {
    id: "evt-jul-1",
    dateRange: "7-р сарын 1 ба 11–12",
    monthIndex: 7,
    phase: "relief",
    phaseLabel: "Эргэлтийн цэг (Соммын дэмжлэг)",
    title: "Соммын тулалдаан ба Сувиллийн сүүлийн дайралт",
    significance:
      "Соммын довтолгоо Германы их буу, хүчийг татаж сарниулснаар 7-р сарын 11–12-нд Сувиллийн бэхлэлт дээр Германы сүүлийн томоохон довтолгоо зогсов.",
    locationId: "battle-center",
    sourceRef: 1,
  },
  {
    id: "evt-oct-dec",
    dateRange: "10-р сарын 24 – 12-р сарын 18",
    monthIndex: 10,
    phase: "counteroffensive",
    phaseLabel: "Намрын сөрөг довтолгоо",
    title: "Францын сөрөг довтолгоо ба тулалдааны төгсгөл",
    significance:
      "Генерал Манжен нарын довтолгоогоор Дуомон (10/24), Во (11/2) бэхлэлтүүдийг эргүүлэн авч, 12-р сарын 18-нд 302 хоногийн тулалдаан анхны шугам орчимд өндөрлөв.",
    locationId: "fort-douaumont",
    sourceRef: 2,
  },
];
