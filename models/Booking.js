import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  bookingId: { type: String, unique: true, sparse: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String },
  customerMobile: { type: String, required: true },
  
  serviceType: { 
    type: String, 
    required: true 
  },
  wayType: { type: String },
  airportDirection: { type: String },
  rentalPackage: { type: String },
  
  // Flat fields to match CreateBooking form
  pickupAddress: { type: String },
  dropAddress: { type: String },
  pickupLat: { type: String },
  pickupLng: { type: String },
  dropLat: { type: String },
  dropLng: { type: String },
  pickupDate: { type: String },
  pickupTime: { type: String },
  returnDate: { type: String },
  returnTime: { type: String },
  
  state: { type: String, required: true },
  pincode: { type: String },
  distance: { type: String },
  
  vehicleCategory: { type: String },
  seater: { type: Number },
  acType: { type: String },
  
  allocateOurPilot: { type: Boolean, default: false },
  
  // Pricing fields
  fare: { type: Number },
  advance: { type: Number, default: 0 },
  dueFare: { type: Number, default: 0 },
  extraKm: { type: Number },
  extraHour: { type: Number },
  waitingCharges: { type: Number },
  nightAllowance: { type: Number },
  tollTax: { type: String },
  
  // Compatibility with old nested structure if needed
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
  pricing: {
    distance: Number,
    totalFare: Number,
    advancedAmount: { type: Number, default: 0 },
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
  completedAt: { type: Date },
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
  ],
  driverName: { type: String },
  driverNumber: { type: String },
  carNo: { type: String }
}, { timestamps: true });

// Generate unique Booking ID before saving
BookingSchema.pre('save', function(next) {
  if (!this.bookingId) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    this.bookingId = `TX${year}${month}${random}`;
  }
  next();
});



BookingSchema.index({ state: 1 });
BookingSchema.index({ bookingId: 1 });

export default mongoose.model('Booking', BookingSchema);

