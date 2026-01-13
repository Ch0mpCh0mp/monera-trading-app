// Datei: src/scripts/hashPassword.ts
import bcrypt from 'bcrypt';

async function createHash() {
  const hash = await bcrypt.hash('123456', 10); // Passwort für Demo-User
  console.log('Password hash:', hash);
}

createHash();
