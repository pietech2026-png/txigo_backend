const Driver = require('../models/Driver');
const Transaction = require('../models/Transaction');

// Helper to format dates to YYYY-MM-DD HH:MM:SS
const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().replace('T', ' ').substring(0, 19);
};

// @desc    Get all drivers with filters and pagination
// @route   GET /api/admin/drivers
// @access  Private
const getDrivers = async (req, res) => {
    console.log('--- Incoming Driver Search Request ---');
    console.log('Query Params:', req.query);
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { category, status, plan, city, state, search, dutyStatus, isNegative, seater } = req.query;

    let query = {};

    if (seater) {
        const cleanSeater = String(seater).trim();
        // Match numbers exactly or as part of a string like "4 Seater"
        query.$or = query.$or || [];
        query.$or.push({ sittingCapacity: { $regex: cleanSeater, $options: 'i' } });
        // Also try exact match if it looks like a number
        if (!isNaN(cleanSeater)) {
            query.$or.push({ sittingCapacity: cleanSeater });
            query.$or.push({ sittingCapacity: Number(cleanSeater) });
        }
    }

    if (category) {
        const cleanCat = category.trim();
        query.vehicleType = { $regex: cleanCat, $options: 'i' };
    }
    if (status) query.status = status;
    if (plan) query.subscriptionPlan = plan;
    if (city) query.city = { $regex: city.trim(), $options: 'i' };
    if (dutyStatus) query.dutyStatus = dutyStatus;
    
    if (isNegative === 'true') {
        query.walletBalance = { $lt: 0 };
    }

    if (state && state.trim()) {
        const cleanState = state.trim();
        query.state = { $regex: cleanState, $options: 'i' };
    }

    if (search && search.trim()) {
        const cleanSearch = search.trim();
        // If state is already provided, we filter WITHIN that state using search
        query.$and = query.$and || [];
        query.$and.push({
            $or: [
                { fullName: { $regex: cleanSearch, $options: 'i' } },
                { email: { $regex: cleanSearch, $options: 'i' } },
                { mobile: { $regex: cleanSearch, $options: 'i' } },
                { city: { $regex: cleanSearch, $options: 'i' } },
                { state: { $regex: cleanSearch, $options: 'i' } }
            ]
        });
    }

    console.log('Final Mongoose Query:', JSON.stringify(query, null, 2));

    try {
        const totalDriversOverall = await Driver.countDocuments({});
        console.log('Total Drivers in DB:', totalDriversOverall);
        
        const total = await Driver.countDocuments(query);
        console.log('Filtered Driver Count:', total);

        const drivers = await Driver.find(query)
            .sort({ registeredAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            total,
            page,
            debugQuery: query, // ADDED FOR DEBUGGING
            drivers: drivers.map(d => ({
                id: d._id,
                fullName: d.fullName,
                email: d.email,
                mobile: d.mobile,
                pincode: d.pincode,
                vehicleType: d.vehicleType,
                rcNumber: d.rcNumber,
                registeredAt: formatDate(d.registeredAt),
                verifyAt: formatDate(d.verifyAt),
                dutyStatus: d.dutyStatus || 'Offline',
                status: d.status,
                statusReason: d.statusReason,
                supportMethod: d.supportMethod,
                supportValue: d.supportValue,
                city: d.city,
                state: d.state,
                fullAddress: d.address,
                subscriptionPlan: d.subscriptionPlan || 'None',
                lastPlanChange: d.lastPlanChange,
                isPlanChangeSeenByAdmin: d.isPlanChangeSeenByAdmin,
                walletBalance: d.walletBalance || 0
            }))
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get single driver details
// @route   GET /api/admin/drivers/:id
// @access  Private
const getDriverDetails = async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id);

        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        const responseData = {
            id: driver._id,
            fullName: driver.fullName,
            dob: driver.dob,
            email: driver.email,
            pincode: driver.pincode,
            state: driver.state,
            city: driver.city,
            address: driver.address,
            mobile: driver.mobile,
            vehicleType: driver.vehicleType,
            rcNumber: driver.rcNumber,
            aadharNumber: driver.aadharNumber,
            panNumber: driver.panNumber,
            dlNumber: driver.dlNumber,
            documents: driver.documents, 
            dutyStatus: driver.dutyStatus || 'Offline',
            status: driver.status,
            statusReason: driver.statusReason,
            supportMethod: driver.supportMethod,
            supportValue: driver.supportValue,
            subscriptionPlan: driver.subscriptionPlan || 'None',
            sittingCapacity: driver.sittingCapacity || '4 Seater',
            lastPlanChange: driver.lastPlanChange,
            isPlanChangeSeenByAdmin: driver.isPlanChangeSeenByAdmin,
            walletBalance: driver.walletBalance || 0,
            registeredAt: formatDate(driver.registeredAt)
        };

        // Mark plan change as seen by admin
        if (driver.isPlanChangeSeenByAdmin === false) {
            driver.isPlanChangeSeenByAdmin = true;
            await driver.save();
        }

        res.json(responseData);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update driver status/details
// @route   PATCH /api/admin/drivers/:id
// @access  Private
const updateDriver = async (req, res) => {
    console.log("Update Request Body:", JSON.stringify(req.body, null, 2));
    try {
        const driver = await Driver.findById(req.params.id);

        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        const updates = req.body;
        
        // Handle documents update separately to deep merge
        if (updates.documents) {
            console.log("Updating documents for driver:", req.params.id, updates.documents);
            // Ensure documents object exists
            if (!driver.documents) driver.documents = {};

            Object.keys(updates.documents).forEach(docKey => {
                const docUpdate = updates.documents[docKey];
                
                // Initialize the sub-document if it doesn't exist in the record
                if (!driver.documents[docKey]) {
                    driver.documents[docKey] = { url: "", status: 'pending', reason: "" };
                }
                
                if (typeof docUpdate === 'string') {
                    driver.documents[docKey].url = docUpdate;
                } else if (typeof docUpdate === 'object') {
                    if (docUpdate.url !== undefined) driver.documents[docKey].url = docUpdate.url;
                    if (docUpdate.status !== undefined) driver.documents[docKey].status = docUpdate.status;
                    if (docUpdate.reason !== undefined) driver.documents[docKey].reason = docUpdate.reason;
                }
            });
            driver.markModified('documents');
            delete updates.documents; // Remove from top-level updates to avoid overwriting
        }

        // Simple manual merge for other top-level fields
        Object.keys(updates).forEach(key => {
            driver[key] = updates[key];
        });

        const updatedDriver = await driver.save();
        res.json(updatedDriver);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Verify/Reject individual document
// @route   POST /api/admin/drivers/:id/verify-document
// @access  Private
const verifyDocument = async (req, res) => {
    const { documentType, status, reason } = req.body;

    try {
        const driver = await Driver.findById(req.params.id);

        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        if (!driver.documents[documentType]) {
            return res.status(400).json({ message: `Document type ${documentType} not found in driver profile` });
        }

        driver.documents[documentType].status = status;
        driver.documents[documentType].reason = reason || "";

        await driver.save();
        res.json({ message: 'Document status updated', documents: driver.documents });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Register a new driver (Public)
// @route   POST /api/drivers/register
// @access  Public
const registerDriver = async (req, res) => {
    console.log("Registration Request Body:", JSON.stringify(req.body, null, 2));
    try {
        const { mobile, email } = req.body;
        const cleanMobile = String(mobile || '').trim();
        const cleanEmail = String(email || '').trim();

        const queryOr = [{ mobile: cleanMobile }];
        if (cleanEmail) queryOr.push({ email: cleanEmail });

        // Check if driver already exists
        const existingDriver = await Driver.findOne({ $or: queryOr });

        if (existingDriver) {
            // If they exist, update their fields instead of erroring
            // This handles the "lead capture" flow where they exist with only mobile
            Object.keys(req.body).forEach(key => {
                if (key !== 'mobile' && key !== 'documents') {
                    existingDriver[key] = req.body[key];
                }
            });
            
            // Merge documents safely
            if (req.body.documents) {
                if (!existingDriver.documents) existingDriver.documents = {};
                Object.keys(req.body.documents).forEach(docKey => {
                    if (!existingDriver.documents[docKey]) {
                        existingDriver.documents[docKey] = req.body.documents[docKey];
                    }
                });
                existingDriver.markModified('documents');
            }

            existingDriver.status = 'Pending';
            const updatedDriver = await existingDriver.save();

            return res.status(200).json({
                message: 'Profile updated successfully',
                driverId: updatedDriver._id
            });
        }

        // Create driver if not exists
        const driver = new Driver({
            ...req.body,
            status: 'Pending'
        });

        const savedDriver = await driver.save();
        res.status(201).json({
            message: 'Registration successful',
            driverId: savedDriver._id
        });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get driver status by mobile number (Public)
// @route   GET /api/drivers/status/:mobile
// @access  Public
const getDriverStatus = async (req, res) => {
    try {
        const mobile = req.params.mobile.trim();
        const driver = await Driver.findOne({ mobile });

        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        res.json({
            id: driver._id,
            fullName: driver.fullName,
            dob: driver.dob,
            email: driver.email,
            mobile: driver.mobile,
            pincode: driver.pincode,
            state: driver.state,
            city: driver.city,
            address: driver.address,
            vehicleType: driver.vehicleType,
            rcNumber: driver.rcNumber,
            aadharNumber: driver.aadharNumber,
            panNumber: driver.panNumber,
            dlNumber: driver.dlNumber,
            status: driver.status,
            statusReason: driver.statusReason,
            sittingCapacity: driver.sittingCapacity || '4 Seater',
            supportMethod: driver.supportMethod,
            supportValue: driver.supportValue,
            documents: driver.documents
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Re-submit driver details (Public)
// @route   PATCH /api/drivers/re-submit/:mobile
// @access  Public
const reSubmitDriver = async (req, res) => {
    try {
        const mobile = req.params.mobile.trim();
        const driver = await Driver.findOne({ mobile });

        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        // Only allow re-submission if Pending or Blocked (or as per business logic)
        const updates = req.body;
        const { shouldUpdateStatus } = req.body;
        
        // Remove helper flags from data updates
        delete updates.shouldUpdateStatus;

        // Handle documents update separately to deep merge
        if (updates.documents) {
            if (!driver.documents) driver.documents = {};

            Object.keys(updates.documents).forEach(docKey => {
                const docUpdate = updates.documents[docKey];
                
                if (!driver.documents[docKey]) {
                    driver.documents[docKey] = { url: "", status: 'Pending', reason: "" };
                }
                
                if (typeof docUpdate === 'string') {
                    driver.documents[docKey].url = docUpdate;
                } else if (typeof docUpdate === 'object') {
                    if (docUpdate.url !== undefined) driver.documents[docKey].url = docUpdate.url;
                    if (docUpdate.status !== undefined) driver.documents[docKey].status = docUpdate.status;
                    if (docUpdate.reason !== undefined) driver.documents[docKey].reason = docUpdate.reason;
                }
            });
            driver.markModified('documents');
            delete updates.documents;
        }

        Object.keys(updates).forEach(key => {
            driver[key] = updates[key];
        });

        // Only set status to Under Review if explicitly requested or if it's the final submission
        if (shouldUpdateStatus !== false) {
            driver.status = 'Under Review';
            driver.verifyAt = null; 
        }

        const updatedDriver = await driver.save();
        res.json({
            message: 'Details re-submitted successfully',
            status: updatedDriver.status
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get driver profile (for mobile app)
// @route   GET /api/driver/profile/:mobile
// @access  Public (Should be protected with mobile/otp token in future)
const getDriverProfile = async (req, res) => {
    try {
        const mobile = req.params.mobile.trim();
        const driver = await Driver.findOne({ mobile });

        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        res.json({
            id: driver._id,
            fullName: driver.fullName,
            mobile: driver.mobile,
            email: driver.email,
            vehicleType: driver.vehicleType,
            status: driver.status,
            subscriptionPlan: driver.subscriptionPlan,
            sittingCapacity: driver.sittingCapacity || '4 Seater',
            lastPlanChange: driver.lastPlanChange,
            walletBalance: driver.walletBalance || 0,
            documents: driver.documents
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update driver subscription plan
// @route   PUT /api/driver/update-plan
// @access  Public (Should be protected)
const updateSubscriptionPlan = async (req, res) => {
    const mobile = String(req.body.mobile || '').trim();
    const { plan } = req.body;

    if (!['None', 'Regular', 'Prime'].includes(plan)) {
        return res.status(400).json({ message: 'Invalid subscription plan' });
    }

    try {
        const driver = await Driver.findOne({ mobile });

        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        const oldPlan = driver.subscriptionPlan;
        
        if (oldPlan !== plan) {
            driver.subscriptionPlan = plan;
            driver.lastPlanChange = new Date();
            driver.isPlanChangeSeenByAdmin = false;
        }

        await driver.save();

        res.json({
            message: `Plan updated to ${plan}`,
            subscriptionPlan: driver.subscriptionPlan
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update driver duty status (Online, Offline, On Ride)
// @route   PUT /api/driver/duty-status
// @access  Public (Should be protected)
const updateDutyStatus = async (req, res) => {
    const mobile = String(req.body.mobile || '').trim();
    const { dutyStatus } = req.body;

    if (!['Online', 'Offline', 'On Ride'].includes(dutyStatus)) {
        return res.status(400).json({ message: 'Invalid duty status' });
    }

    try {
        const driver = await Driver.findOne({ mobile });

        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        driver.dutyStatus = dutyStatus;
        await driver.save();

        res.json({
            message: `Duty status updated to ${dutyStatus}`,
            dutyStatus: driver.dutyStatus
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getDistinctStates = async (req, res) => {
    try {
        const states = await Driver.distinct('state');
        // Filter out nulls/empties and sort
        const cleanStates = states.filter(s => s).sort();
        res.json(cleanStates);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update driver wallet balance
// @route   POST /api/driver/wallet/update
// @access  Public (Should be protected)
const updateDriverWallet = async (req, res) => {
    let { mobile, amount, category, description } = req.body;

    if (!mobile) {
        return res.status(400).json({ message: 'Mobile number is required' });
    }

    mobile = String(mobile).trim();
    console.log(`[WalletUpdate] Querying driver with mobile: "${mobile}"`);

    if (!amount || isNaN(amount)) {
        return res.status(400).json({ message: 'Valid amount is required' });
    }

    try {
        const driver = await Driver.findOne({ mobile });

        if (!driver) {
            console.log(`[WalletUpdate] Driver NOT found for mobile: "${mobile}"`);
            return res.status(404).json({ message: 'Driver not found' });
        }

        // Update balance
        driver.walletBalance = (driver.walletBalance || 0) + parseFloat(amount);
        await driver.save();

        // Create transaction record
        await Transaction.create({
            userType: 'Driver',
            userId: driver._id,
            amount: Math.abs(amount),
            type: amount >= 0 ? 'Credit' : 'Debit',
            category: category || 'Commission',
            description: description || 'Wallet balance update',
            status: 'Completed'
        });

        res.json({
            message: 'Wallet updated successfully',
            newBalance: driver.walletBalance
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete a driver
// @route   DELETE /api/admin/drivers/:id
// @access  Private
const deleteDriver = async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id);
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        await Driver.deleteOne({ _id: req.params.id });
        res.json({ message: 'Driver removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getDrivers,
    getDriverDetails,
    updateDriver,
    verifyDocument,
    getDistinctStates,
    registerDriver,
    getDriverStatus,
    reSubmitDriver,
    getDriverProfile,
    updateSubscriptionPlan,
    updateDutyStatus,
    updateDriverWallet,
    deleteDriver
};
