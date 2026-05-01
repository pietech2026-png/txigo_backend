import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerEmail: { type: String },
  customerMobile: { type: String, required: true },
  
  serviceType: { 
    type: String, 
    enum: ['Outstation', 'Rental', 'Airport Ride', 'Station Ride'],
    required: true 
  },
  wayType: { type: String },
  airportDirection: { type: String },
  rentalPackage: { type: String },
  
  pickup: {
    address: String,
    lat: Number,
    lng: Number,
    pincode: String,
    state: String
  },
  drop: {
    address: String,
    lat: Number,
    lng: Number
  },
  pickupTime: { type: Date, required: true },
  returnTime: { type: Date },
  
  vehicle: {
    category: String,
    carModel: String,
    seater: Number,
    isAC: { type: Boolean, default: true }
  },
  
  isOwnPilotAllocated: { type: Boolean, default: false },
  
  pricing: {
    distance: Number,
    totalFare: Number,
    advancedAmount: { type: Number, default: 0 },
    pilotShare: Number,
    companyShare: Number,
    extraCharges: {
      nightAllowance: Number,
      toll: Number,
      extraKm: Number,
      extraHour: Number
    }
  },
  
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Outstation', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  state: { type: String, required: true },
  assignedDriverMobile: { type: String, default: null },
  acceptedByPilot: { 
    name: String,
    mobile: String,
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' }
  },
  allocatedPilot: {
    name: String,
    mobile: String,
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' }
  },
  eligiblePilots: [{
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
    name: String,
    mobile: String
  }],
  acceptedAt: { type: Date },
  cancellationReason: { type: String },
  cancelledBy: { 
    type: String, 
    enum: ['Pilot', 'User', 'Admin'],
    default: null
  },
  timeline: [
    {
      status: String,
      message: String,
      timestamp: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

BookingSchema.index({ state: 1 });

export default mongoose.model('Booking', BookingSchema);
