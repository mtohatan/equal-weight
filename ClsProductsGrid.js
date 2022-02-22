import * as React from "react";

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

class ClsProductsGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
    //---------------
    this.enterEdit = this.enterEdit.bind(this);
    this.remove = this.remove.bind(this);
    this.add = this.add.bind(this);
    this.discard = this.discard.bind(this);
    this.update = this.update.bind(this);
    this.cancel = this.cancel.bind(this);
  }
  //const [data, setData] = React.useState([]);

  //Component is loading
  componentDidMount() {
    let newItems = getItems();

    const equalWeight = checkEqualWeight(newItems);
    if (equalWeight && newItems.length !== 0) {
      let newWeight = calculateWeight(newItems);
      for (const [i, product] of newItems.entries()) {
        product.Weight = newWeight;
      }
    }

    this.setState({ data: newItems });
  } // modify the data in the store, db etc

  remove = (dataItem) => {
    const newData = deleteItem(dataItem);
    this.setState({ data: newData });
  };

  add = (dataItem) => {
    dataItem.inEdit = true;
    const newData = insertItem(dataItem);
    this.setState({ data: newData });
  };

  update = (dataItem) => {
    dataItem.inEdit = false;
    const newData = updateItem(dataItem);
    this.setState({ data: newData });
  }; // Local state operations

  discard = () => {
    const newData = [...this.data];
    newData.splice(0, 1);
    this.setState({ data: newData });
  };

  cancel = (dataItem) => {
    const originalItem = getItems().find(
      (p) => p.ProductID === dataItem.ProductID
    );
    const newData = this.state.data.map((item) =>
      item.ProductID === originalItem.ProductID ? originalItem : item
    );
    this.setState({ data: newData });
  };

  enterEdit = (dataItem) => {
    const editData = this.state.data.map((item) =>
      item.ProductID === dataItem.ProductID ? { ...item, inEdit: true } : item
    );
    this.setState({ data: editData });
  };

  itemChange = (event) => {
    const newData = this.state.data.map((item) =>
      item.ProductID === event.dataItem.ProductID
        ? { ...item, [event.field || ""]: event.value }
        : item
    );
    this.setState({ data: newData });
  };

  addNew = () => {
    const newDataItem = {
      inEdit: true,
      Discontinued: false,
    };
    this.setState({ data: [newDataItem, ...this.state.data] });
  };

  CommandCell = (props) => (
    <MyCommandCell
      {...props}
      edit={this.enterEdit}
      remove={this.remove}
      add={this.add}
      discard={this.discard}
      update={this.update}
      cancel={this.cancel}
      editField={editField}
    />
  );

  render() {
    return (
      <div>
        <Grid
          style={{
            height: "560px",
            width: "1200px",
          }}
          data={this.state.data}
          onItemChange={this.itemChange}
          editField={editField}
        >
          <GridToolbar>
            <button
              title="Add new"
              className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
              onClick={this.addNew}
            >
              Add new
            </button>
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
          <Column cell={this.CommandCell} width="200px" filterable={false} />
        </Grid>
      </div>
    );
  }
}

export default ClsProductsGrid;
