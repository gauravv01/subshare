import prisma from "../db";

export const getBankDetails = async (req: any,res:any) => {
    const user = req.user;
    console.log(req.user,"req.body");
    const bankDetails = await prisma.paymentMethod.findMany({ where: { userId: user.id } });
    return res.status(200).json(bankDetails);
};

export const addBankDetails = async (req: any,res:any) => {
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
    return res.status(200).json(bankDetails);
};

export const updateBankDetails = async (req: any,res:any) => {
    const user = req.user;
    const {  cardNumber, cardHolderName, cardExpirationDate, cardCvv ,type,provider} = req.body;
    const bankDetails = await prisma.paymentMethod.update({ where: { id: user.id }, data: { cardNumber, cardHolderName, cardExpirationDate, cardCvv ,type,provider} });
    return res.status(200).json(bankDetails);
};

export const deleteBankDetails = async (req: any,res:any) => {
    const user = req.user;
    const bankDetails = await prisma.paymentMethod.delete({ where: { id: user.id } });
    return res.status(200).json(bankDetails);
};

export const addWithdrawalMethod = async (req: any,res:any) => {
    const user = req.user;
    const { type, provider, bankName, accountNumber, routingNumber, swiftCode, accountHolderName } = req.body;
    const withdrawalMethod = await prisma.withdrawalMethod.create({ data: { userId: user.id, type, provider, bankName, accountNumber, routingNumber, swiftCode, accountHolderName } });
    return res.status(200).json(withdrawalMethod);
};

export const updateWithdrawalMethod = async (req: any,res:any) => {
    const user = req.user;
    const { type, provider, bankName, accountNumber, routingNumber, swiftCode, accountHolderName } = req.body;
    const withdrawalMethod = await prisma.withdrawalMethod.update({ where: { id: user.id }, data: { type, provider, bankName, accountNumber, routingNumber, swiftCode, accountHolderName } });
    return res.status(200).json(withdrawalMethod);
};

export const fetchWithdrawalMethods = async (req: any,res:any) => {
    const user = req.user;
    const withdrawalMethods = await prisma.withdrawalMethod.findMany({ where: { userId: user.id } });
    return res.status(200).json(withdrawalMethods);
};





