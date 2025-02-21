import {CustomerDto} from "../Dtos/CustomerDto.ts";
import { BaseResponse } from "../../../BaseResponse.ts";

export interface VerifyPhoneCodeResponse extends BaseResponse{
    messageInformation: string | null;
    customerDto: CustomerDto | null;
}



