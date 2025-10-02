/**
 * Force restart server script - Kills all Node processes and starts fresh
 */

const { spawn, exec } = require('child_process');
const path = require('path');

console.log('🔄 Restarting HopeChain Backend Server...\n');

// Kill all existing Node processes
console.log('🛑 Killing existing Node processes...');
exec('taskkill /f /im node.exe', (error, stdout, stderr) => {
  if (error && !error.message.includes('not found')) {
    console.log('⚠️  Error killing processes:', error.message);
  } else {
    console.log('✅ All Node processes terminated');
  }
  
  // Wait a moment then start the server
  setTimeout(() => {
    console.log('\n🚀 Starting fresh server...');
    
    const serverProcess = spawn('node', ['server.js'], {
      cwd: __dirname,
      stdio: 'inherit'
    });
    
    serverProcess.on('error', (error) => {
      console.error('❌ Failed to start server:', error);
    });
    
    serverProcess.on('exit', (code) => {
      console.log(`\n📊 Server exited with code: ${code}`);
    });
    
  }, 2000);
});