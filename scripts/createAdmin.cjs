const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash("pw1234", 10);

  await prisma.user.create({
    data: {
      email: "test@testuser.com",
      password: hashed,
      name: "Test User",
      role: "staff",
    },
  });

  console.log("Admin user created");
  process.exit(0);
}

main();
