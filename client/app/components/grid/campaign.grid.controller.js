export default class CampaignGridCtrl {
  constructor() {
    const columnDefs = [
      {headerName: "Make", field: "make", editable: true},
      {headerName: "Model", field: "model", editable: true},
      {headerName: "Price", field: "price", editable: true},
      {headerName: "Country", field: "country", editable: true,
        cellEditor: 'select',
        cellEditorParams: {
          values: ["Argentina", "Brazil", "Colombia", "France", "Germany", "Greece", "Iceland", "Ireland",
            "Italy", "Malta", "Portugal", "Norway", "Peru", "Spain", "Sweden", "United Kingdom",
            "Uruguay", "Venezuela"]
        }
      },
      {headerName: "Language", field: "language", editable: true,
        cellEditor: 'select',
        cellEditorParams: {
          values: ['English', 'Spanish', 'French', 'Portuguese', '(other)']
        }
      }
    ];

    const rowData = [
      {make: "Toyota", model: "Celica", price: 35000, country: "France", language: "French"},
      {make: "Ford", model: "Mondeo", price: 32000, country: "Greece", language: "Portuguese"},
      {make: "Porsche", model: "Boxter", price: 72000, country: "United Kingdom", language: "English"},
      {make: "Toyota", model: "Celica", price: 35000, country: "France", language: "French"},
      {make: "Ford", model: "Mondeo", price: 32000, country: "Greece", language: "Portuguese"},
      {make: "Porsche", model: "Boxter", price: 72000, country: "United Kingdom", language: "English"},
      {make: "Toyota", model: "Celica", price: 35000, country: "France", language: "French"},
      {make: "Ford", model: "Mondeo", price: 32000, country: "Greece", language: "Portuguese"},
      {make: "Porsche", model: "Boxter", price: 72000, country: "United Kingdom", language: "English"}
    ];

    const countries = [
      {country: "Ireland", continent: "Europe", language: "English"},
      {country: "Spain", continent: "Europe", language: "Spanish"},
      {country: "United Kingdom", continent: "Europe", language: "English"},
      {country: "France", continent: "Europe", language: "French"},
      {country: "Germany", continent: "Europe", language: "(other)"},
      {country: "Sweden", continent: "Europe", language: "(other)"},
      {country: "Norway", continent: "Europe", language: "(other)"},
      {country: "Italy", continent: "Europe", language: "(other)"},
      {country: "Greece", continent: "Europe", language: "(other)"},
      {country: "Iceland", continent: "Europe", language: "(other)"},
      {country: "Portugal", continent: "Europe", language: "Portuguese"},
      {country: "Malta", continent: "Europe", language: "(other)"},
      {country: "Brazil", continent: "South America", language: "Portuguese"},
      {country: "Argentina", continent: "South America", language: "Spanish"},
      {country: "Colombia", continent: "South America", language: "Spanish"},
      {country: "Peru", continent: "South America", language: "Spanish"},
      {country: "Venezuela", continent: "South America", language: "Spanish"},
      {country: "Uruguay", continent: "South America", language: "Spanish"}
    ];

    this.gridOptions = {
      height: 200,
      columnDefs: columnDefs,
      rowData: rowData,
      headerHeight: 38,
      rowHeight: 38,
      enableSorting: true,
      enableColResize: true, //one of [true, false]
      enableFilter: true, //one of [true, false]
      enableStatusBar: true,
      enableRangeSelection: true,
      rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
      rowDeselection: true,
      icons: {
        menu: '<i class="fa fa-bars"/>',
        //columnVisible: '<i class="fa fa-eye"/>',
        //columnHidden: '<i class="fa fa-eye-slash"/>',
        columnRemoveFromGroup: '<i class="fa fa-remove"/>',
        filter: '<i class="fa fa-filter"/>',
        sortAscending: '<i class="fa fa-long-arrow-down"/>',
        sortDescending: '<i class="fa fa-long-arrow-up"/>'
        // groupExpanded: '<i class="fa fa-minus-square-o"/>',
        // groupContracted: '<i class="fa fa-plus-square-o"/>',
        // columnGroupOpened: '<i class="fa fa-minus-square-o"/>',
        // columnGroupClosed: '<i class="fa fa-plus-square-o"/>'
      }
    };
  }
}
