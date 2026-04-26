const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  // Customer
  customerName: { type: String, required: true },
  customerEmail: { type: String },
  customerMobile: { type: String, required: true },
  
  // Trip Configuration
  serviceType: { 
    type: String, 
    enum: ['Outstation', 'Rental', 'Airport Ride', 'Station Ride'],
    required: true 
  },
  wayType: { type: String }, // One-way / Roundtrip
  airportDirection: { type: String }, // To / From
  rentalPackage: { type: String },
  
  // Route details
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
  returnTime: { type: Date }, // Optional field for Outstation Roundtrips
  
  // Vehicle details
  vehicle: {
    category: String, // Mini, Sedan, SUV
    carModel: String,
    seater: Number,
    isAC: { type: Boolean, default: true }
  },
  
  // Internal Flags
  isOwnPilotAllocated: { type: Boolean, default: false },
  
  // Financials
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
  
  // Status & Assignment
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Outstation', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
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

module.exports = mongoose.model('Booking', BookingSchema);
