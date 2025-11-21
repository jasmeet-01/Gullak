const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { isValidObjectId, Types } = require("mongoose");

// Get Dashboard Data
exports.getDashboardData = async (req, res) => {
    try{
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(String(userId));

        //fetch total income and total expense
        const totalIncome = await Income.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        console.log("Total Income ", {totalIncome, userId: isValidObjectId(userId)});

        const totalExpense = await Expense.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        console.log("Total Expense ", {totalExpense, userId: isValidObjectId(userId)});

        //Get income transactions in the last 60 days
        const last60daysIncomeTransactions=await Income.find({
            userId,
            date: { $gte: new Date(Date.now() - 60*24*60*60*1000) },
        }).sort({ date: -1 });

        //Get total income for last 60 days
        const incomelast60days=last60daysIncomeTransactions.reduce(
            ( sum, transaction ) => sum + transaction.amount, 0
        );

        //Get expense transactions in last 30 days
        const last30daysExpenseTransactions=await Expense.find({
            userId,
            date: { $gte: new Date(Date.now() - 30*24*60*60*1000) },
        }).sort({ date: -1 });

        //Get total expense for last 30 days
        const expenselast30days=last30daysExpenseTransactions.reduce(
            ( sum, transaction ) => sum + transaction.amount, 0
        );

        //Fetch last 5 transactions(income + expense)
        const lastTransactions = [
            ...(await Income.find({ userId }).sort({ date: -1 }).limit(5)).map(
                (txn) => ({
                    ...txn.toObject(),
                    type: "income",
                })
            ),
            ...(await Expense.find({ userId }).sort({ date: -1 }).limit(5)).map(
                (txn) => ({
                    ...txn.toObject(),
                    type: "expense",
                })
            ),
        ].sort((a, b) => b.date - a.date); //sort lastest first

        //final Response
        res.json({
            totalBalance:
                (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
            totalIncome: totalIncome[0]?.total || 0,
            totalExpense: totalExpense[0]?.total || 0,
            last30daysExpense: {
                total: expenselast30days,
                transactions: last30daysExpenseTransactions,
            },
            last60daysIncome: {
                total: incomelast60days,
                transactions: last60daysIncomeTransactions,
            },
            recentTransactions: lastTransactions,
        });
    } catch (err){
        res.status(500).json({ message: "Server Error" });
    }
};