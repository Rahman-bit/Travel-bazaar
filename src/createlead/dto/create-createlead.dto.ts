import mongoose from "mongoose";

export interface User {
    id? :string;
    customerFirstName? : string;
    customerLastName? : string;
    customerEmail? : string;
    customerMobile? : number;
    createdDate? : string;
    country? : string;
    state? : string;
    city? : string;
    zipcode? : number;
  }

export interface UserDocument extends User, mongoose.Document{
    id? :string;
    customerFirstName? : string;
    customerLastName? : string;
    customerEmail? : string;
    customerMobile? : number;
    createdDate? : string;
    country? : string;
    state? : string;
    city? : string;
    zipcode? : number;
}
