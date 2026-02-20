import { SkuVariants as ModalSkuVariants } from "../edit-product-modal/types";
import shoesWhite1 from "@site/static/images/shoes-white1.png";
import shoesWhite2 from "@site/static/images/shoes-white2.png";
import shoesGraphite1 from "@site/static/images/shoes-graphite1.png";
import shoesGraphite2 from "@site/static/images/shoes-graphite2.png";

const modalMockData: {
  skuVariants: ModalSkuVariants;
  productSummary: { productId: string; displayName: string };
} = {
  skuVariants: {
    colors: [
      { colorCode: "ffffff", displayName: "White", available: true },
      { colorCode: "444444", displayName: "Graphite", available: true },
    ],
    sizes: [
      { size: "10", available: true },
      { size: "11", available: true },
      { size: "12", available: true },
    ],
    availableSkus: [
      { id: "1", colorCode: "ffffff", size: "10", listPrice: "128.00", salePrice: "98.00", available: true },
      { id: "2", colorCode: "ffffff", size: "11", listPrice: "128.00", available: false },
      { id: "3", colorCode: "ffffff", size: "12", listPrice: "128.00", available: true },
      { id: "4", colorCode: "444444", size: "10", listPrice: "128.00", available: false },
      { id: "5", colorCode: "444444", size: "11", listPrice: "128.00", available: true },
      { id: "6", colorCode: "444444", size: "12", listPrice: "128.00", available: true },
    ],
    imagesByColorCode: {
      "ffffff": [shoesWhite1, shoesWhite2],
      "444444": [shoesGraphite1, shoesGraphite2],
    },
  },
  productSummary: {
    productId: "prod1234",
    displayName: "BestBrand Sneakers",
  },
};

export default modalMockData;
