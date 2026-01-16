export const global = $state({
    display: "welcome-back",
    userRowInfo: {
        id: "",
        Name: "",
        Email: "",
        EPCCRelationship: "",
        IsActive: false,
        Trainings: [true],
        CurrentStation: "",
        InitialTimeStamp: 0,
        teacher: "Personal",
        Class: false
    },
    accountSuccessfullyCreated: false,
    idExists: false
})