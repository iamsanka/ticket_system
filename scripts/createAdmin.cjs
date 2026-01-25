const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = "admin1@taprobane.fi";
  const password = "chamitha@1991";

  console.log("Checking if admin already exists...");

  // 🔍 Check if user already exists
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    console.log(`❌ Admin user already exists with email: ${email}`);
    console.log("No new user was created.");
    process.exit(0);
  }

  // 🔐 Hash password
  const hashed = await bcrypt.hash(password, 10);

  // 🆕 Create new admin
  await prisma.user.create({
    data: {
      email,
      password: hashed,
      name: "Taprobane Staff",
      role: "ADMIN",
    },
  });

  console.log("✅ Admin user created successfully!");
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Error creating admin:", err);
  process.exit(1);
});
