import { sampleProducts } from "../Data/no-weight";
/* import { sampleProducts } from "../Data/sample-products";
import { sampleProducts } from "../Data/no-products"; */

let data = [...sampleProducts];

const generateId = (data) =>
  data.reduce((acc, current) => Math.max(acc, current.ProductID), 0) + 1;

export const insertItem = (item) => {
  item.ProductID = generateId(data);
  item.inEdit = false;

  data.unshift(item);

  let newWeight = calculateWeight(data);
  for (const [i, product] of data.entries()) {
    //console.log("product: " + JSON.stringify(product));
    product.Weight = newWeight;
  }

  return data;
};
export const getItems = () => {
  return data;
};
export const updateItem = (item) => {
  let index = data.findIndex((record) => record.ProductID === item.ProductID);
  data[index] = item;
  return data;
};
export const deleteItem = (item) => {
  let index = data.findIndex((record) => record.ProductID === item.ProductID);
  data.splice(index, 1);

  let newWeight = calculateWeight(data);
  for (const [i, product] of data.entries()) {
    //console.log("product: " + JSON.stringify(product));
    product.Weight = newWeight;
  }

  return data;
};

export const calculateWeight = (data) => {
  let weight = 100 / data.length;
  //console.log("Equal weight is: " + weight);

  for (const [i, product] of data.entries()) {
    //console.log("product: " + JSON.stringify(product));
  }

  //console.log("Number of products is: " + data.length);
  weight = (Math.round(weight * 100) / 100).toFixed(2);
  return weight;
};

export const checkEqualWeight = (data) => {
  //check if there is data
  if (data.length == 0) {
    return true;
  } else {
    //check if there is any weight value
    //if a value is found return false,
    //otherwise return true
    for (const [i, product] of data.entries()) {
      //console.log("product: " + JSON.stringify(product));
      if (product.Weight !== undefined) {
        return false;
      } else {
        return true;
      }
    }
  }
};
