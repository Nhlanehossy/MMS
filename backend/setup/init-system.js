require('dotenv').config();
const axios = require('axios');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:4500/api/v1';
const api = axios.create({ baseURL: API_BASE_URL });

let store = {};

async function initSystem() {
    console.log('Starting system initialization...');
    try {
        // 1. Create essential modules
        console.log('\n1. Creating modules...');
        const modules = await createModules();
        store.modules = modules;

        // 2. Create admin role
        console.log('\n2. Creating admin role...');
        const adminRole = await createAdminRole();
        store.adminRole = adminRole;

        // 3. Set up permissions
        console.log('\n3. Setting up permissions...');
        await setupPermissions(adminRole._id, modules);

        // 4. Create basic data
        console.log('\n4. Creating basic data...');
        const { genders, statuses } = await createBasicData();
        store = { ...store, genders, statuses };

        // 5. Create initial configurations
        console.log('\n5. Creating initial configurations...');
        await createInitialConfigs();

        // 6. Create admin user
        console.log('\n6. Creating admin user...');
        await createAdminUser(store);

        console.log('\nSystem initialization completed successfully!');
        console.log('\nCreated references:', JSON.stringify(store, null, 2));

    } catch (error) {
        console.error('Initialization failed:', error.response?.data || error.message);
        process.exit(1);
    }
}

async function createModules() {
    const modulesList = [
        'genders',
        'staff-statuses',
        'roles',
        'modules',
        'permissions',
        'users',
        'system-logs',
        'system-config',
        'company-config'
    ];

    const modules = {};
    for (const moduleName of modulesList) {
        const response = await api.post('/modules', {
            moduleName,
            description: `${moduleName} management module`
        });
        modules[moduleName] = response.data._id;
        console.log(`✓ Created module: ${moduleName}`);
    }
    return modules;
}

async function createAdminRole() {
    const response = await api.post('/roles', {
        roleName: 'Admin',
        description: 'System Administrator with full access'
    });
    console.log('✓ Created Admin role');
    return response.data;
}

async function setupPermissions(roleId, modules) {
    const permissions = Object.entries(modules).map(([moduleName, moduleId]) => ({
        role: roleId,
        module: moduleId,
        create: true,
        read: true,
        update: true,
        delete: true
    }));

    for (const permission of permissions) {
        await api.post('/permissions', permission);
        console.log(`✓ Created permissions for ${permission.module}`);
    }
}

async function createBasicData() {
    // Create genders
    const genders = {};
    const gendersList = ['Male', 'Female'];
    for (const gender of gendersList) {
        const response = await api.post('/genders', {
            gender,
            description: `${gender} gender`
        });
        genders[gender] = response.data._id;
        console.log(`✓ Created gender: ${gender}`);
    }

    // Create statuses
    const statuses = {};
    const statusesList = ['Active', 'Inactive'];
    for (const status of statusesList) {
        const response = await api.post('/staff-statuses', {
            status,
            description: `${status} status`
        });
        statuses[status] = response.data._id;
        console.log(`✓ Created status: ${status}`);
    }

    return { genders, statuses };
}

async function createInitialConfigs() {
    // Create system config
    const systemConfig = {
        logo: process.env.LOGO_URL || 'https://firebasestorage.googleapis.com/v0/b/server-services-50a49.appspot.com/o/logo%2Flogo.png?alt=media&token=113d4b82-3d88-414e-8c87-e85d6ea7ed5b',
        appName: process.env.APP_NAME || 'System factory',
        appVersion: '1.0.0',
        appLanguage: 'en',
        loginPageLayout: 'DefaultLayout',
        maintenanceMode: false,
        appDescription: 'Initial system setup',
        maintenanceMessage: 'System is under maintenance'
    };

    await api.post('/system-config', systemConfig);
    console.log('✓ Created system configuration');

    // Create company config
    const companyConfig = {

        companyName: process.env.COMPANY_NAME || 'My Company',
        companyAddress: 'Company Address',
        companyLocation: 'Company Location',
        companyMotto: 'Company Motto',
        companyEmails: [
            {
                name: 'Info',
                email: process.env.COMPANY_EMAIL || 'info@company.com'
            }
        ],
        companyPhoneNumbers: [
            {
                name: 'Main',
                phoneNumber: process.env.COMPANY_PHONE || '+1234567890'
            }
        ]
    };

    await api.post('/company-config', companyConfig);
    console.log('✓ Created company configuration');
}

async function createAdminUser(store) {
    const adminUser = {
        undefined:'',
        fullname: 'Administrator',
        email: process.env.ADMIN_EMAIL || 'admin@system.com',
        password: process.env.ADMIN_PASSWORD || 'Admin123!',
        phoneNumber: '+1234567890',
        dateOfBirth: '1990-01-01',
        recruitmentDate: new Date().toISOString().split('T')[0],
        role: store.adminRole._id,
        status: store.statuses['Active'],
        gender: store.genders['Male'],
        description: 'System Administrator'
    };

    await api.post('/users/register', adminUser);
    console.log('✓ Created admin user');
}

// Execute initialization
initSystem();