import * as React from "react";
// import { Checkbox } from "@progress/kendo-react-inputs";

import {
  Grid,
  GridColumn as Column,
  GridToolbar,
} from "@progress/kendo-react-grid";

import { MyCommandCell } from "./MyCommandCell";
import {
  insertItem,
  getItems,
  updateItem,
  deleteItem,
  checkEqualWeight,
  calculateWeight,
} from "../Services/ProductsServices";

const editField = "inEdit";

const ProductsGrid = () => {
  const [data, setData] = React.useState([]);

  //Component is loading
  React.useEffect(() => {
    let newItems = getItems();

    const equalWeight = checkEqualWeight(newItems);
    if (equalWeight && newItems.length !== 0) {
      let newWeight = calculateWeight(newItems);
      for (const [i, product] of newItems.entries()) {
        //console.log("product: " + JSON.stringify(product));
        product.Weight = newWeight;
      }
    }

    setData(newItems);
  }, []); // modify the data in the store, db etc

  const remove = (dataItem) => {
    const newData = deleteItem(dataItem);
    setData(newData);
  };

  const add = (dataItem) => {
    dataItem.inEdit = true;
    const newData = insertItem(dataItem);
    setData(newData);
  };

  const update = (dataItem) => {
    dataItem.inEdit = false;
    const newData = updateItem(dataItem);
    setData(newData);
  }; // Local state operations

  const discard = () => {
    const newData = [...data];
    newData.splice(0, 1);
    setData(newData);
  };

  const cancel = (dataItem) => {
    const originalItem = getItems().find(
      (p) => p.ProductID === dataItem.ProductID
    );
    const newData = data.map((item) =>
      item.ProductID === originalItem.ProductID ? originalItem : item
    );
    setData(newData);
  };

  const enterEdit = (dataItem) => {
    setData(
      data.map((item) =>
        item.ProductID === dataItem.ProductID ? { ...item, inEdit: true } : item
      )
    );
  };

  const itemChange = (event) => {
    const newData = data.map((item) =>
      item.ProductID === event.dataItem.ProductID
        ? { ...item, [event.field || ""]: event.value }
        : item
    );
    setData(newData);
  };

  const addNew = () => {
    const newDataItem = {
      inEdit: true,
      Discontinued: false,
    };
    setData([newDataItem, ...data]);
  };

  const CommandCell = (props) => (
    <MyCommandCell
      {...props}
      edit={enterEdit}
      remove={remove}
      add={add}
      discard={discard}
      update={update}
      cancel={cancel}
      editField={editField}
    />
  );

  /*   const setEqualWeight = (event) => {
    console.log("Setting weight: " + event.value);
  }; */

  return (
    <div>
      <Grid
        style={{
          height: "560px",
          width: "1200px",
        }}
        data={data}
        onItemChange={itemChange}
        editField={editField}
      >
        <GridToolbar>
          <button
            title="Add new"
            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
            onClick={addNew}
          >
            Add new
          </button>
          {/*           <Checkbox
            label={"Set equal weight"}
            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary k-grid-edit-command"
            onChange={setEqualWeight}
          /> */}
        </GridToolbar>
        <Column
          field="ProductID"
          title="Id"
          width="50px"
          editable={false}
          filterable={false}
        />
        <Column field="ProductName" title="Product Name" width="200px" />
        <Column
          field="FirstOrderedOn"
          title="First Ordered"
          editor="date"
          format="{0:d}"
          width="150px"
          filterable={false}
        />
        <Column
          field="UnitsInStock"
          title="Units"
          width="120px"
          editor="numeric"
          filterable={false}
        />
        <Column
          field="Discontinued"
          title="Discontinued"
          editor="boolean"
          filterable={false}
        />
        <Column
          field="Weight"
          title="Weight"
          width="120px"
          editor="numeric"
          filterable={false}
        />
        <Column cell={CommandCell} width="200px" filterable={false} />
      </Grid>
    </div>
  );
};

export default ProductsGrid;
