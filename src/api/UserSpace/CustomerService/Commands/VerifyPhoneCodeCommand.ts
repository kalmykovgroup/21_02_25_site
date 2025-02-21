export interface VerifyPhoneCodeCommand {
    /** Номер телефона пользователя */
    phoneNumber: string;

    /** Код отправленный на телефон */
    code: string;

}