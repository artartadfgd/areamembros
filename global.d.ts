type Messages = typeof import("./messages/en.json");

// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- next-intl's typed-messages pattern
declare interface IntlMessages extends Messages {}
