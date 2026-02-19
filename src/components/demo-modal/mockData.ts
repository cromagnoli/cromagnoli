
import { SkuVariants as DemoSkuVariants } from "./types";
import { SkuVariants as ModalSkuVariants } from "../edit-product-modal/types";

export const mockVariants: DemoSkuVariants = {
  colors: [
    { code: "fff", name: "White" },
    { code: "444", name: "Graphite" }
  ],
  sizes: [{ size: "S" }, { size: "M" }, { size: "L" }],
  skus: [
    { id: "1", color: { code: "fff", name: "White" }, size: "S", price: { listPrice: "58.00", currency: { code: "USD" } }, available: true },
    { id: "2", color: { code: "fff", name: "White" }, size: "M", price: { listPrice: "48.00", currency: { code: "USD" } }, available: true },
    { id: "3", color: { code: "444", name: "Graphite" }, size: "M", price: { listPrice: "38.00", currency: { code: "USD" } }, available: true },
  ],
  productSummary: {
    productId: "prod1234",
    displayName: "BestBrand Sneakers"
  }
};

const modalMockData: {
  skuVariants: ModalSkuVariants;
  productSummary: { productId: string; displayName: string };
} = {
  skuVariants: {
    colors: [
      { colorCode: "WHT", displayName: "White", available: true },
      { colorCode: "GPH", displayName: "Graphite", available: true },
    ],
    sizes: [
      { size: "8", available: true },
      { size: "9", available: true },
      { size: "10", available: true },
    ],
    availableSkus: [
      { id: "1", colorCode: "WHT", size: "8", listPrice: "128.00", available: true },
      { id: "2", colorCode: "WHT", size: "9", listPrice: "128.00", available: false },
      { id: "3", colorCode: "WHT", size: "10", listPrice: "128.00", available: true },
      { id: "4", colorCode: "GPH", size: "8", listPrice: "128.00", available: false },
      { id: "5", colorCode: "GPH", size: "9", listPrice: "128.00", available: true },
      { id: "6", colorCode: "GPH", size: "10", listPrice: "128.00", available: true },
    ],
    imagesByColorCode: {
      WHT: ["/images/shoes-white.png"],
      GPH: ["/images/shoes-graphite.png"],
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
