import {
  AutocompleteSelectCellEditor,
  DataFormat,
  IAutocompleteSelectCellEditorParameters,
} from 'ag-grid-autocomplete-editor'
import { ColDef, Grid } from 'ag-grid-community'
import { StringIterator } from 'cypress/types/lodash'

describe('ag-grid-autocomplete-editor end-to-end customization option tests', () => {
  it('should customize autocomplete items according to render function', function () {
    cy.fixture('selectDatas/names.json').as('selectDatas')
    // @ts-ignore
    cy.visit('./cypress/static/ag-grid-autocomplete-editor-test-sandbox.html')
    cy.get('#myGrid').then((indexQueryElement) => {
      const rowDatas = [
        { 'autocomplete-column': undefined },
        { 'autocomplete-column': undefined },
        { 'autocomplete-column': undefined },
        { 'autocomplete-column': undefined },
        { 'autocomplete-column': undefined },
      ]
      const columnDefs: ColDef[] = [
        {
          headerName: 'Already present data selector',
          field: 'autocomplete-column',
          // @ts-ignore
          cellEditor: AutocompleteSelectCellEditor,
          cellEditorParams: {
            selectData: this.selectDatas,
            placeholder: 'Select an option',
            required: true,
            autocomplete: {
              render: (cellEditor: AutocompleteSelectCellEditor, item: DataFormat): HTMLElement => {
                const itemElement = document.createElement('div')
                itemElement.textContent = `${item.label}_customized`
                return itemElement
              },
            },
          },
          valueFormatter: (parameters) => {
            if (parameters.value) {
              return parameters.value.label || parameters.value.value || parameters.value
            }
            return ''
          },
          editable: true,
        },
      ]
      const gridOptions = {
        columnDefs,
        rowData: rowDatas,
        suppressScrollOnNewData: false,
        suppressBrowserResizeObserver: true,
      }
      new Grid(<HTMLElement>indexQueryElement.get(0), gridOptions)
    })
    // ag-grid should be created on the DOM
    cy.get('.ag-root').should('exist')
    cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('not.exist')
    // Start the edition
    cy.get('.ag-row-first > .ag-cell ').type('{enter}').type('Ke')
    cy.get('.autocomplete.ag-cell-editor-autocomplete').should('exist')
    // Should contain the customized rendered label
    cy.get('.autocomplete > div:nth-child(1)').contains('Kelley Santana_customized')
    // Should select the first element and hit enter it to select
    cy.get('.ag-row-first > .ag-cell ').type('{downArrow}').type('{enter}')
    // input should have been closed
    cy.get('div.ag-cell-editor-autocomplete-wrapper > .ag-cell-editor-autocomplete-input').should('not.exist')
    // Input should have been selected and sent to ag-grid
    cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('exist')
    cy.get('.ag-row-first > .ag-cell ').type('{del}') // TODO ? .type('{enter}') -> suppressKeyboardEvent
    cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('exist')
  })
  it('should customize autocomplete items according to renderGroup function', function () {
    cy.fixture('selectDatas/groups.json').as('selectDatas')
    cy.visit('./cypress/static/ag-grid-autocomplete-editor-test-sandbox.html')
    cy.get('#myGrid').then((indexQueryElement) => {
      const rowDatas = [
        { 'autocomplete-column': undefined },
        { 'autocomplete-column': undefined },
        { 'autocomplete-column': undefined },
        { 'autocomplete-column': undefined },
        { 'autocomplete-column': undefined },
      ]

      const columnDefs: ColDef[] = [
        {
          headerName: 'Already present data selector',
          field: 'autocomplete-column',
          // @ts-ignore
          cellEditor: AutocompleteSelectCellEditor,
          cellEditorParams: {
            selectData: this.selectDatas,
            placeholder: 'Select an option',
            required: true,
            autocomplete: {
              renderGroup: (_, name: string) => {
                const groupDiv = document.createElement('div')
                groupDiv.textContent = `${name}_customized`
                groupDiv.className = 'group'
                return groupDiv
              },
            },
          },
          valueFormatter: (parameters) => {
            if (parameters.value) {
              return parameters.value.label || parameters.value.value || parameters.value
            }
            return ''
          },
          editable: true,
        },
      ]
      const gridOptions = {
        columnDefs,
        rowData: rowDatas,
        suppressScrollOnNewData: false,
        suppressBrowserResizeObserver: true,
      }
      new Grid(<HTMLElement>indexQueryElement.get(0), gridOptions)
    })
    // ag-grid should be created on the DOM
    cy.get('.ag-root').should('exist')
    cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('not.exist')
    // Start the edition
    cy.get('.ag-row-first > .ag-cell ').type('{enter}').type('Ke')
    cy.get('.autocomplete.ag-cell-editor-autocomplete').should('exist')
    // Should have groups rendered
    cy.get('.autocomplete > div.group').should('exist')
    cy.get('.autocomplete > div.group').should('have.length', 2)
    cy.get('.autocomplete > div.group:nth(0)').contains('Female_customized')
    cy.get('.autocomplete > div.group:nth(1)').contains('Male_customized')
  })
})
