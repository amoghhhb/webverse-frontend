const fs = require('fs');
const path = require('path');

function fixPermissions() {
  try {
    const vitePath = path.join(__dirname, 'node_modules', '.bin', 'vite');
    
    // Check if file exists
    if (!fs.existsSync(vitePath)) {
      console.log('⚠️ Vite binary not found at:', vitePath);
      return;
    }

    // Set execute permissions (755)
    fs.chmodSync(vitePath, 0o755);
    console.log('✅ Successfully set execute permissions for Vite');
    
    // Verify permissions
    const stats = fs.statSync(vitePath);
    const mode = stats.mode.toString(8);
    console.log(`ℹ️ Current permissions: ${mode.slice(-3)}`);
    
  } catch (error) {
    console.error('❌ Error setting permissions:', error.message);
    process.exit(1); // Exit with error code
  }
}

fixPermissions();
