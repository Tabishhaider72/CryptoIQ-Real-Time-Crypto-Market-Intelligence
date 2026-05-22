import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";

async function main() {
  const password =
    await bcrypt.hash(
      "demo123",
      10
    );

  await prisma.user.upsert({
    where: {
      email:
        "demo@kuvaka.io",
    },

    update: {},

    create: {
      name: "Demo User",

      email:
        "demo@kuvaka.io",
      role: "user",

      password,
    },
  });

  console.log(
    "Demo user seeded"
  );
}

main()
  .catch((e) => {
    console.error(e);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });