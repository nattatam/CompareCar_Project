import type { ImageCredit } from "@/lib/types";

// Image credits keyed by the local image path in public/images/cars/.
// Images released under CC0 / public domain need no attribution, but we still
// record their Wikimedia Commons source so it can be linked from the credits
// page. Images with no photo yet are not listed.
export const IMAGE_CREDITS: Record<string, ImageCredit> = {
  "/images/cars/tesla-model-3.jpg": {
    author: "iMoD Official",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2024_Tesla_Model_3_Performance_front_view_04.png",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0/",
    note: "Source video: https://www.youtube.com/watch?v=Lr1FdX7Pi5o",
    videoUrl: "https://www.youtube.com/watch?v=Lr1FdX7Pi5o",
  },
  "/images/cars/jaecoo-5-ev.png": {
    author: "iMoD Official",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2025_Jaecoo_5_EV_Max_(Thailand)_front_view.png",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0/",
    note: "Source video: https://www.youtube.com/watch?v=qBTYMFKgPeQ",
    videoUrl: "https://www.youtube.com/watch?v=qBTYMFKgPeQ",
  },
  "/images/cars/geely-ex5-max+.jpg": {
    author: "Chanokchon",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:2026_Geely_EX5_Max%2B.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  "/images/cars/geely-starray-em-r.jpg": {
    author: "Chanokchon",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2026_Geely_Starray_EM-R_Max.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  "/images/cars/ora-5-ev-ultra.jpg": {
    author: "Chanokchon",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2026_ORA_5_EV_Ultra.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  "/images/cars/jaecoo-6t.jpg": {
    author: "Chanokchon",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2026_Jaecoo_J6T_REEV_Ultra_4WD.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  "/images/cars/nevo-q05.jpg": {
    author: "Chanokchon",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:2026_Nevo_Q05.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  "/images/cars/omoda-c5-ev.jpg": {
    author: "Andra Febrian",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2026_Omoda_C5_EV_(Thailand)_front_view.jpg",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
  },
  "/images/cars/mg-s5-ev.jpg": {
    author: "Chanokchon",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:2025_MG_S5_EV_V.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  "/images/cars/changan-lumin.jpg": {
    author: "Chanokchon",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2024_Changan_Lumin_L_DC.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  "/images/cars/gac-aion-v.jpg": {
    author: "Chanokchon",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2024_Aion_V_602_Luxury.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  "/images/cars/hyptec-ht.jpg": {
    author: "Tim Wu",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:GAC_Aion_Hyper_HT_Gull-wing_in_Grandview_Mall,_Guangzhou_20240309.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  "/images/cars/jaecoo-6-ev.jpg": {
    author: "S5A-0043",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:(SGP-Singapore)_Private_Jaecoo_6_EV_SYY733X_2025-08-24.jpg",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
  },
  "/images/cars/mg-4-d.jpg": {
    author: "Alexander-93",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:MG4_EV_IMG_9349.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  "/images/cars/mg-4-x.jpg": {
    author: "Chanokchon",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2026_MG_4_Electric_X.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  "/images/cars/mg-urban-standard.jpg": {
    author: "Chanokchon",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2026_MG_Urban_Standard.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  "/images/cars/mg-urban-max.jpg": {
    author: "Chanokchon",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2026_MG_Urban_Max.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  "/images/cars/mg-urban-ultra.jpg": {
    author: "Chanokchon",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2026_MG_Urban_Ultra_(2).jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  "/images/cars/byd-dolphin.jpg": {
    author: "Alexander-93",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:BYD_Dolphin_IAA_2023_1X7A0367.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  "/images/cars/byd-seal.jpg": {
    author: "Alexander-93",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:BYD_Seal_IAA_2023_1X7A0371.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  "/images/cars/byd-atto-3.jpg": {
    author: "Alexander-93",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:BYD_Atto_3_1X7A6495.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  "/images/cars/byd-m6.jpg": {
    author: "User3204",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:2024_BYD_M6_(front).jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  "/images/cars/byd-seal-5-dm-i.jpg": {
    author: "Ethan Llamas",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:BYD_Seal_5_DM-i_Dynamic_Arctic_White_-_front.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  "/images/cars/byd-seal-6.jpg": {
    author: "Chanokchon",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2026_BYD_Seal_6_EV_Premium.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  "/images/cars/byd-sealion-7.jpg": {
    author: "iMoD Official",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2024_BYD_Sealion_7_Performance_AWD_(Thailand)_front_view.png",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0/",
    note: "Source video: https://www.youtube.com/watch?v=DXQhRIJKM38",
    videoUrl: "https://www.youtube.com/watch?v=DXQhRIJKM38",
  },
};

// CC0 / public-domain sources (no attribution required, source shown for credit).
export const PUBLIC_DOMAIN_SOURCES: Record<string, { sourceUrl: string }> = {
  "/images/cars/byd-atto-1.jpg": {
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:BYD_Seagull_facelift_001.jpg",
  },
  "/images/cars/tesla-model-3-standard.jpg": {
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Tesla_Model_3_Standard.jpg",
  },
  "/images/cars/tesla-model-3-premium.jpg": {
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:24_Tesla_Model_3_Base.jpg",
  },
  "/images/cars/gac-aion-ut.jpg": {
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Aion_UT_005.jpg",
  },
  "/images/cars/gac-aion-y-plus.jpg": {
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2024_GAC_Aion_Y_Plus_Premium_in_TSM_Bandung_01.jpg",
  },
  "/images/cars/geely-ex2.jpg": {
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Geely_Xingyuan_001.jpg",
  },
  "/images/cars/geely-ex5.jpg": {
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Geely_Galaxy_E5_010.jpg",
  },
  "/images/cars/ora-5.jpg": {
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Ora_5_001.jpg",
  },
  "/images/cars/byd-atto-2.jpg": {
    sourceUrl: "https://commons.wikimedia.org/wiki/File:BYD_Yuan_Up_001.jpg",
  },
  "/images/cars/byd-sealion-5-dm-i.jpg": {
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:BYD_Song_Pro_DM-i_2024_facelift_001.jpg",
  },
  "/images/cars/byd-sealion-6-dm-i.jpg": {
    sourceUrl: "https://commons.wikimedia.org/wiki/File:BYD_Sealion_6_DM-i.jpg",
  },
  "/images/cars/deepal-e07.jpg": {
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Nevo_E07_007.jpg",
  },
  "/images/cars/deepal-k50.jpg": {
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Nevo_Hunter_K50_001.jpg",
  },
  "/images/cars/deepal-s05.jpg": {
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Deepal_S05_001.jpg",
  },
  "/images/cars/deepal-s07.jpg": {
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Shenlan_S7_014.jpg",
  },
};

export function getImageCredit(image: string): ImageCredit | undefined {
  return IMAGE_CREDITS[image];
}

export function getPublicDomainSource(image: string): string | undefined {
  return PUBLIC_DOMAIN_SOURCES[image]?.sourceUrl;
}