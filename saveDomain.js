// saveDomain.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'domains.db');
const db = new sqlite3.Database(dbPath);

// Save domain with duplicate check
function saveUserDomain(email, domainType, domainValue) {
  const checkQuery = `
    SELECT * FROM user_domains WHERE user_email = ? AND domain_value = ?
  `;
  db.get(checkQuery, [email, domainValue], (err, row) => {
    if (err) {
      return console.error('❌ Error checking domain:', err.message);
    }
    if (row) {
      return console.log(`⚠️ Domain already exists for ${email}: ${domainValue}`);
    }

    const insertQuery = `
      INSERT INTO user_domains (user_email, domain_type, domain_value)
      VALUES (?, ?, ?)
    `;
    db.run(insertQuery, [email, domainType, domainValue], function (err) {
      if (err) {
        console.error('❌ Failed to insert domain info:', err.message);
      } else {
        console.log(`✅ Domain info saved: ${email} => ${domainType} => ${domainValue}`);
      }
    });
  });
}

// Get all domains for a user
function getDomainsForUser(email, callback) {
  const query = `SELECT domain_type, domain_value FROM user_domains WHERE user_email = ?`;
  db.all(query, [email], (err, rows) => {
    if (err) {
      console.error('❌ Error fetching domains:', err.message);
      return callback(err);
    }
    callback(null, rows);
  });
}

module.exports = { saveUserDomain, getDomainsForUser };
