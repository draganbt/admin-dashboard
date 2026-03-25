// hash-passwords.ts
import * as bcrypt from 'bcrypt';

async function hashPasswords() {
  const passwords = ['changeme', 'changeme', 'changeme'];
  for (const pwd of passwords) {
    const hashed = await bcrypt.hash(pwd, 10);
    console.log(hashed);
  }
}

hashPasswords();
