import prisma from "../db";

export const getProfile = async (req: any, res: any) => {
    const user = req.user;
  const profile = await prisma.user.findUnique({ where: { id: user.id } });
  res.status(200).json(profile);
};

export const updateProfile = async (req: any, res: any) => {
    const user = req.user;
    const { name, email, phoneNumber, language, country ,timezone} = req.body;
    const profile = await prisma.user.update({ where: { id: user.id }, data: { name, email, phoneNumber, language, country, timezone } });
    res.status(200).json(profile);
};

export const updateOtherProfile = async (req: any, res: any) => {
    const { id } = req.params;
    const { name, email, phoneNumber, language, country ,timezone} = req.body;
    const profile = await prisma.user.update({ where: { id }, data: { name, email, phoneNumber, language, country, timezone } });
    res.status(200).json(profile);
};



