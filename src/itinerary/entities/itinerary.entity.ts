
import { Schema } from 'mongoose';

const ServiceItemSchema = new Schema({
  id: { type: String },
  isChecked: { type: Boolean },
  serviceName: { type: String }
});

const DescriptionSchema = new Schema({
  id: { type: String },
  dayTitleText: { type: String },
  dayDescriptionText: { type: String }
});

const TransportationSchema = new Schema({
  id: { type: String },
  transportationTitle: { type: String },
  transpotationMode: { type: String },
  departingCountry: { type: String },
  departingCity: { type: String },
  startingPoint: { type: String },
  departDate: { type: String },
  actualDepartureTime: { type: String },
  reportingTime: { type: String },
  arrivalCountry: { type: String },
  arrivalCity: { type: String },
  endingPoint: { type: String },
  arrialDate: { type: String },
  actualArrivalTime: { type: String },
  transpotationNote: { type: String }
});

const HotelSchema = new Schema({
  id: { type: String },
  checkInDate: { type: String },
  checkInTime: { type: String },
  numberOfNights: { type: String },
  adults: { type: String },
  rooms: { type: String },
  childs: { type: String },
  extrabed: { type: String },
  roomTypes: { type: String },
  noteText: { type: String }
});

const MealTypeSchema = new Schema({
  id: { type: String },
  isChecked: { type: Boolean },
  selectMealType: { type: String }
});

const MealSchema = new Schema({
  id: { type: String },
  mealTitle: { type: String },
  mealDescription: { type: String },
  selecdtMeal: { type: [MealTypeSchema], default: [] }
});

const DayWisePlanSchema = new Schema({
  id: { type: String },
  day: { type: String },
  description: { type: [DescriptionSchema], default: [] },
  transportation: { type: [TransportationSchema], default: [] },
  hotel: { type: [HotelSchema], default: [] },
  checkoutHotel: { type: [HotelSchema], default: [] },
  sightseeing: { type: Array, default: [] },
  meal: { type: [MealSchema], default: [] }
});

export const ItinerarySchema = new Schema({
  id: { type: String },
  createdDate: { type: String },
  itineraryTitle: { type: String },
  destination: { type: String },
  typeOfHoliday: { type: String },
  noOfAdults: { type: String },  // changed from Number to String
  noOfKids: { type: String },    // changed from Number to String
  startDate: { type: String },
  endDate: { type: String },
  coupleList: { type: String },
  currencyType: { type: String },
  budgetForTrip: { type: String }, // changed from Number to String
  serviceList: { type: [ServiceItemSchema], default: [] },  // updated serviceList
  noOfNights: { type: String },  // changed from Number to String
  travellers: { type: String },  // changed from Number to String
  welcomenote: { type: String },
  customerName: { type: String },
  emailId: { type: String },
  mobileNumber: { type: String },
  address: { type: String },
  country: { type: String },
  state: { type: String },
  city: { type: String },
  postalCode: { type: String },
  birthDate: { type: String },
  anniversaryDate: { type: String },
  note: { type: String },
  inclusion: { type: String },
  exclusion: { type: String },
  cost: { type: String },  // changed from Number to String
  termsConditions: { type: String },
  tips: { type: String },
  otherVisaInformation: { type: String },
  thankyounote: { type: String },
  changestatus: { type: String, default: 'New' },
  dayWisePlanFinal: { type: [DayWisePlanSchema], default: [] },
  previousPage: { type: String }
}, { timestamps: true });
