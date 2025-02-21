export interface CustomerDto {
    id: string; // Guid в C# -> string в TypeScript

    /** Номер телефона пользователя */
    phoneNumber: string;

    /** Имя пользователя */
    firstName?: string | null;

    /** Фамилия пользователя */
    lastName?: string | null;

    /** Отчество пользователя */
    patronymic?: string | null;

    /** Дата рождения */
    dateOfBirth?: string | null; // DateTime в C# -> string в TypeScript (ISO формат)

    /** Электронная почта пользователя */
    email?: string | null;
}
