import prisma from "../db";

export const getBankDetails = async (req: any) => {
    const user = req.user;
    console.log(user);
    const bankDetails = await prisma.paymentMethod.findMany({ where: { userId: user.id } });
    return bankDetails;
};

export const addBankDetails = async (req: any) => {
    const user = req.user;
    const { cardNumber, cardHolderName, cardExpirationDate, cardCvv ,type,provider} = req.body;

    const bankDetails = await prisma.paymentMethod.create({
        data: {
            userId: user.id,
            cardNumber,
            cardHolderName,
            cardExpirationDate,
            cardCvv,
            type,
            provider
        }
    });
    return bankDetails;
};

export const updateBankDetails = async (req: any) => {
    const user = req.user;
    const {  cardNumber, cardHolderName, cardExpirationDate, cardCvv ,type,provider} = req.body;
    const bankDetails = await prisma.paymentMethod.update({ where: { id: user.id }, data: { cardNumber, cardHolderName, cardExpirationDate, cardCvv ,type,provider} });
    return bankDetails;
};

export const deleteBankDetails = async (req: any) => {
    const user = req.user;
    const bankDetails = await prisma.paymentMethod.delete({ where: { id: user.id } });
    return bankDetails;
};

export const addWithdrawalMethod = async (req: any) => {
    const user = req.user;
    const { type, provider, bankName, accountNumber, routingNumber, swiftCode, accountHolderName } = req.body;
    const withdrawalMethod = await prisma.withdrawalMethod.create({ data: { userId: user.id, type, provider, bankName, accountNumber, routingNumber, swiftCode, accountHolderName } });
    return withdrawalMethod;
};

export const updateWithdrawalMethod = async (req: any) => {
    const user = req.user;
    const { type, provider, bankName, accountNumber, routingNumber, swiftCode, accountHolderName } = req.body;
    const withdrawalMethod = await prisma.withdrawalMethod.update({ where: { id: user.id }, data: { type, provider, bankName, accountNumber, routingNumber, swiftCode, accountHolderName } });
    return withdrawalMethod;
};

export const fetchWithdrawalMethods = async (req: any) => {
    const user = req.user;
    const withdrawalMethods = await prisma.withdrawalMethod.findMany({ where: { userId: user.id } });
    return withdrawalMethods;
};





