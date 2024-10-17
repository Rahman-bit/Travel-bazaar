import { Document } from "mongoose";

export class CreateCreateitineraryDto {}

export interface ServiceItem {
  id?: string;
  isChecked?: boolean;
  serviceName?: string;
}

export interface Description {
  id?: string;
  dayTitleText?: string;
  dayDescriptionText?: string;
}

export interface Transportation {
  id?: string;
  transportationTitle?: string;
  transpotationMode?: string;
  departingCountry?: string;
  departingCity?: string;
  startingPoint?: string;
  departDate?: string;
  actualDepartureTime?: string;
  reportingTime?: string;
  arrivalCountry?: string;
  arrivalCity?: string;
  endingPoint?: string;
  arrialDate?: string;
  actualArrivalTime?: string;
  transpotationNote?: string;
}

export interface Hotel {
  id?: string;
  checkInDate?: string;
  checkInTime?: string;
  numberOfNights?: string;
  adults?: string;
  rooms?: string;
  childs?: string;
  extrabed?: string;
  roomTypes?: string;
  noteText?: string;
}

export interface MealType {
  id?: string;
  isChecked?: boolean;
  selectMealType?: string;
}

export interface Meal {
  id?: string;
  mealTitle?: string;
  mealDescription?: string;
  selecdtMeal?: MealType[];
}

export interface DayWisePlan {
  id?: string;
  day?: string;
  description?: Description[];
  transportation?: Transportation[];
  hotel?: Hotel[];
  checkoutHotel?: Hotel[];
  sightseeing?: any[]; 
  meal?: Meal[];
}

export interface Itinerary extends Document {
  remove: any;
  id?: string;
  createdDate?: string;
  itineraryTitle?: string;
  destination?: string;
  typeOfHoliday?: string;
  noOfAdults?: string;
  noOfKids?: string;
  startDate?: string;
  endDate?: string;
  coupleList?: string;
  currencyType?: string;
  budgetForTrip?: string;
  serviceList?: ServiceItem[];
  noOfNights?: string;
  travellers?: string;
  welcomenote?: string;
  customerName?: string;
  emailId?: string;
  mobileNumber?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  postalCode?: string;
  birthDate?: string;
  anniversaryDate?: string;
  note?: string;
  inclusion?: string;
  exclusion?: string;
  cost?: string;
  termsConditions?: string;
  tips?: string;
  otherVisaInformation?: string;
  thankyounote?: string;
  changestatus?: string;
  dayWisePlanFinal?: DayWisePlan[];
  previousPage?: string;
}
