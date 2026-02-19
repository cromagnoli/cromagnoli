
import { SkuVariants } from "./types";

export const mockVariants: SkuVariants = {
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