// saveDomain.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to DB
const dbPath = path.resolve(__dirname, 'domains.db');
const db = new sqlite3.Database(dbPath);

// Function to save user domain info
function saveUserDomain(email, domainType, domainValue) {
  const query = `
    INSERT INTO user_domains (user_email, domain_type, domain_value)
    VALUES (?, ?, ?)
  `;
  
  db.run(query, [email, domainType, domainValue], function(err) {
    if (err) {
      console.error('❌ Failed to insert domain info:', err.message);
    } else {
      console.log(`✅ Domain info saved: ${email} => ${domainType} => ${domainValue}`);
    }
  });
}

module.exports = { saveUserDomain };
