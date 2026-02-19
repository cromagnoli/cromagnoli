import { SkuVariants as ModalSkuVariants } from "../edit-product-modal/types";
import shoesWhite from "@site/static/images/shoes-white.png";
import shoesGraphite from "@site/static/images/shoes-graphite.png";

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
      { size: "8", available: true },
      { size: "9", available: true },
      { size: "10", available: true },
    ],
    availableSkus: [
      { id: "1", colorCode: "ffffff", size: "8", listPrice: "128.00", available: true },
      { id: "2", colorCode: "ffffff", size: "9", listPrice: "128.00", available: false },
      { id: "3", colorCode: "ffffff", size: "10", listPrice: "128.00", available: true },
      { id: "4", colorCode: "444444", size: "8", listPrice: "128.00", available: false },
      { id: "5", colorCode: "444444", size: "9", listPrice: "128.00", available: true },
      { id: "6", colorCode: "444444", size: "10", listPrice: "128.00", available: true },
    ],
    imagesByColorCode: {
      "ffffff": [shoesWhite],
      "444444": [shoesGraphite],
    },
  },
  productSummary: {
    productId: "prod1234",
    displayName: "BestBrand Sneakers",
  },
};

export default modalMockData;


// product: {
//   allSize: [{ size: "ONE SIZE", available: true }],
//       colors: [
//     {
//       name: "Black",
//       code: "0001",
//     },
//     {
//       name: "Pink Pastel",
//       code: "45773",
//     },
//     {
//       code: "47896",
//       name: "Green Olive",
//     },
//   ],
//       skus: [
//     {
//       available: true,
//       id: "145350559",
//       color: {
//         code: "0001",
//         name: "Black",
//       },
//       size: "ONE SIZE",
//       price: {
//         onSale: false,
//         salePrice: null,
//         listPrice: "58.00",
//         currency: {
//           code: "USD",
//         },
//       },
//     },
//     {
//       available: true,
//       id: "146898546",
//       color: {
//         code: "47896",
//         name: "Green Olive",
//       },
//       size: "ONE SIZE",
//       price: {
//         onSale: false,
//         salePrice: null,
//         listPrice: "80.00",
//         currency: {
//           code: "USD",
//         },
//       },
//     },
//     {
//       available: false,
//       id: "146377983",
//       color: {
//         code: "45773",
//         name: "Pink Pastel",
//       },
//       size: "ONE SIZE",
//       price: {
//         onSale: false,
//         salePrice: null,
//         listPrice: "78.00",
//         currency: {
//           code: "USD",
//         },
//       },
//     },
//   ],
//       productSummary: {
//     productId: "prod10870477",
//         displayName: "Crossbody Camera Bag 2L",
//         parentCategoryUnifiedId: "accessories",
//         unifiedId: "Crossbody-Camera-Bag",
//   },
// },
