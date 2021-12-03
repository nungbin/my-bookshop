
using from './project1/annotations';

annotate CatalogService.Books with @(
    UI: {
        SelectionFields  : [
            ID, author.name
        ],
        LineItem  : [
            { Value: ID          },
            { Value: title       },
            { Value: author.name },
            { Value: stock,      }
        ],
    }
);


annotate CatalogService.Books with {
    ID @title : '{i18n>ID}';
};


using from './project2/annotations';
