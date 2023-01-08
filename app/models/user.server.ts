import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "~/db.server";
export type { User } from "@prisma/client";

export function countUsers() {
  return prisma.user.count();
}

export function getUsers(currentPage: number = 1) {
  const perPage = 20;
  return prisma.user.findMany({
    include: {
      orders: true,
      addresses: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: perPage,
    skip: (currentPage - 1) * perPage,
  });
}

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({
    where: { id },
    include: { addresses: true },
  });
}

export async function getUserRole(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function getUserByToken(passwordResetToken) {
  return prisma.user.findFirst({
    where: {
      password: {
        passwordResetToken,
        passwordResetDate: {
          gt: new Date(),
        },
      },
    },
    select: {
      email: true,
      password: {
        select: {
          passwordResetToken: true,
        },
      },
    },
  });
}

export async function createUser(email: User["email"], password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}

export async function createOrUpdateUser(
  { email, first_name, last_name },
  ids: Pick<User, "email" | "first_name" | "last_name">
) {
  return prisma.user.upsert({
    where: {
      email,
    },
    update: {
      email,
      first_name,
      last_name,
      cart: {
        connect: ids,
      },
    },
    create: {
      email,
      first_name,
      last_name,
      password: {
        create: {
          hash: crypto.randomBytes(21).toString("base64").slice(0, 21),
        },
      },
      cart: {
        connect: ids,
      },
    },
  });
}

export async function createOrUpdateUserAddresses(
  {
    shipping_id,
    billing_id,
    first_name,
    last_name,
    address1,
    address2,
    city,
    state_code,
    country_code,
    zip,
    b_first_name,
    b_last_name,
    b_address1,
    b_address2,
    b_city,
    b_state_code,
    b_country_code,
    b_zip,
  },
  { id }: Pick<User, "email" | "first_name" | "last_name">
) {
  return prisma.user.update({
    where: { id },
    data: {
      addresses: {
        upsert: [
          {
            where: { id: shipping_id || "" },
            create: {
              first_name,
              last_name,
              address1,
              address2,
              city,
              state_code,
              country_code,
              zip,
            },
            update: {
              first_name,
              last_name,
              address1,
              address2,
              city,
              state_code,
              country_code,
              zip,
            },
          },
          {
            where: { id: billing_id || "" },
            create: {
              type: "BILLING",
              first_name: b_first_name || first_name,
              last_name: b_last_name || last_name,
              address1: b_address1 || address1,
              address2: b_address2 || address2,
              city: b_city || city,
              state_code: b_state_code || state_code,
              country_code: b_country_code || country_code,
              zip: b_zip || zip,
            },
            update: {
              type: "BILLING",
              first_name: b_first_name || first_name,
              last_name: b_last_name || last_name,
              address1: b_address1 || address1,
              address2: b_address2 || address2,
              city: b_city || city,
              state_code: b_state_code || state_code,
              country_code: b_country_code || country_code,
              zip: b_zip || zip,
            },
          },
        ],
      },
    },
  });
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"]
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}

export async function updateUserToken(email: User["email"]) {
  const resetToken = crypto.randomBytes(32).toString("hex");
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const passwordResetDate = new Date(Date.now() + 10 * 60 * 1000);

  const userPasswordReset = await prisma.user.update({
    where: { email },
    data: {
      password: {
        update: {
          passwordResetToken,
          passwordResetDate,
        },
      },
    },
    select: {
      password: {
        select: {
          passwordResetToken: true,
        },
      },
    },
  });

  return userPasswordReset;
}

export async function updateUserPassword(
  email: User["email"],
  password: string
) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const userPasswordUpdate = await prisma.user.update({
    where: { email },
    data: {
      password: {
        update: {
          hash: hashedPassword,
          passwordResetToken: null,
          passwordResetDate: null,
        },
      },
    },
  });

  return userPasswordUpdate;
}
