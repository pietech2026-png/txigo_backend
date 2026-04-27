import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
    url: { type: String, default: "" },
    status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
    reason: { type: String, default: "" }
}, { _id: false });

const DriverSchema = new mongoose.Schema({
    fullName: { type: String, default: "" },
    dob: { type: String },
    email: { type: String, unique: true, sparse: true },
    mobile: { type: String, required: true, unique: true },
    pincode: { type: String },
    state: { type: String, default: "" },
    city: { type: String, default: "" },
    address: { type: String },
    vehicleType: { type: String, enum: ['scooty', 'bike', 'car', 'mini', 'sedan'], default: 'car' },
    sittingCapacity: { type: String, default: "4 Seater" },
    rcNumber: { type: String },
    aadharNumber: { type: String },
    panNumber: { type: String },
    dlNumber: { type: String },
    documents: {
        aadharFront: DocumentSchema,
        aadharBack:  DocumentSchema,
        panFront:    DocumentSchema,
        panBack:     DocumentSchema,
        dlFront:     DocumentSchema,
        dlBack:      DocumentSchema,
        rcFront:     DocumentSchema,
        rcBack:      DocumentSchema,
        carFront:    DocumentSchema,
        carBack:     DocumentSchema
    },
    status: { 
        type: String, 
        enum: ['verified', 'Under Review', 'Rejected', 'Pending', 'Active', 'Inactive'], 
        default: 'Pending' 
    },
    statusReason: { type: String, default: "" },
    supportMethod: { type: String, enum: ['Call', 'WhatsApp', 'Chat'], default: 'Call' },
    supportValue: { type: String, default: "" },
    subscriptionPlan: { 
        type: String, 
        enum: ['None', 'Regular', 'Prime'], 
        default: 'None' 
    },
    lastPlanChange: { type: Date },
    isPlanChangeSeenByAdmin: { type: Boolean, default: false },
    walletBalance: { type: Number, default: 0 },
    verifyAt: { type: Date },
    registeredAt: { type: Date, default: Date.now },
    dutyStatus: { 
        type: String, 
        enum: ['Online', 'Offline', 'On Ride'], 
        default: 'Offline' 
    }
}, { timestamps: true });

DriverSchema.set('toJSON', { virtuals: true });
DriverSchema.set('toObject', { virtuals: true });

export default mongoose.model('Driver', DriverSchema);
