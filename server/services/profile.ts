import prisma from "../db";

export const getProfile = async (req: any) => {
    const user = req.user;
  const profile = await prisma.user.findUnique({ where: { id: user.id } });
  return profile;
};

export const updateProfile = async (req: any) => {
    const user = req.user;
    const { name, email, phoneNumber, language, country ,timezone} = req.body;
    const profile = await prisma.user.update({ where: { id: user.id }, data: { name, email, phoneNumber, language, country, timezone } });
    return profile;
};




