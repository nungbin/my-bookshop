using myCompany.hr.lms as lms from '../db/Students';

annotate lms.Students with @(
    UI: {
        SelectionFields  : [
            email,
            first_name            
        ],

        LineItem: [
            {
                $Type : 'UI.DataField',
                Value : email,
                ![@UI.Importance] : #High
            },
            {
                $Type: 'UI.DataField',
                Value : first_name,
                ![@UI.Importance] : #High
            },
            {
                $Type : 'UI.DataField',
                Value : last_name,
                ![@UI.Importance] : #High
            },
            {
                $Type : 'UI.DataField',
                Value : date_sign_up,
                ![@UI.Importance] : #Medium
            },
            {
                $Type : 'UI.DataField',
                Value : full_name,
                Label : '{i18n>full_name}',
                ![@UI.Hidden],
                ![@UI.Importance] : #Low
            }
        ],

        
    },

    //Object Page
    UI: {
        HeaderInfo  : {
            $Type          : 'UI.HeaderInfoType',
            TypeName       : 'Type Name',
            TypeNamePlural : 'Type Plural',
            Title          : {Value: email}
        },
        HeaderFacets  : [
            {
                $Type  : 'UI.ReferenceFacet',
                Target : '@UI.FieldGroup#Description'
            }
        ],
        FieldGroup #Description : { 
            Data: [
                {
                    $Type : 'UI.DataField',
                    Value : email
                },
                {
                    $Type : 'UI.DataField',
                    Value : first_name
                },
                {
                    $Type : 'UI.DataField',
                    Value : last_name
                },
                {
                    $Type : 'UI.DataField',
                    Value : date_sign_up
                }
            ]
        },
    }
);


