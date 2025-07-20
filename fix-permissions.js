const fs = require('fs');
const path = require('path');

try {
  const vitePath = path.join(__dirname, 'node_modules', '.bin', 'vite');
  
  if (process.platform !== 'win32') {
    // Unix-based systems
    fs.chmodSync(vitePath, '755');
    console.log('✅ Set execute permissions for Vite');
  } else {
    // Windows workaround
    console.log('⚠️ Windows detected, skipping permission change');
  }
} catch (error) {
  console.error('❌ Error setting permissions:', error.message);
}