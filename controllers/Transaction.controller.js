const asyncHandler = require("express-async-handler"); //this is used to handle error in json(bcs of that we dont need trycatch)
const TransactionModel = require("../models/Transaction.model");

exports.CreateTransaction = asyncHandler(async (req, res) => {
  const { type, category, amount, date, description } = req.body;
  if (!type || !amount || !date) {
    throw new Error(
      "type,amount and date field required to create transaction"
    );
  }
  const transaction = await TransactionModel.create({
    user: req.user,
    type,
    category,
    amount,
    description,
  });
  res.json(transaction);
});

//fetch and list
exports.FetchTransaction = asyncHandler(async (req, res) => {
  const category = await TransactionModel.find({ user: req.user });
  res.status(200).json(category);
});
//filter transaction(according to date(start,end),category)
exports.FilterTransaction = asyncHandler(async (req, res) => {
  const { startDate, endDate, type, category } = req.query;
  const filter = {user:req.user}
    //due to filter is option we can fix by use condition
  if(startDate){
    filter.date()={...filter.date,$gte:new Date(startDate)}
  }
  if(endDate){
    filter.date()={...filter.date,$lte:new Date(startDate)}
  }
  if(type){
    filter.type=type;
  }
  if(category){
    if(category=='All'){//return all category if no result no catogory filter
    }else if(category==="Uncategorized"){
      filter.category ='Uncategorized'
    }else{
      filter.category=category
    }
  }; //we can add aditional data here
  const transaction = await TransactionModel.find(filter).sort({date:-1});//decs(sort data by)
  res.json({ transaction });
});

exports.UpdateTransaction = asyncHandler(async (req, res) => {
  //filter transaction by id && check if that transaction belong to that user
  console.log({"request param id ":req.params.id,"reqiest user id":req.user})
  const transaction = await TransactionModel.findById(req.params.id);
  if(transaction&&transaction.user.toString()===req.user.toString()){
    //we can use .save or findbyIdAndUpdate
    transaction.type=req.body.type||transaction.type
    transaction.category=req.body.category||transaction.category
    transaction.amount=req.body.amount||transaction.amount
    transaction.description=req.body.description||transaction.description
    transaction.date=req.body.date||transaction.date
    // await transaction.save()
    const updatedTransaction = await transaction.save();
    res.json(updatedTransaction);
  }
});

exports.DeleteTransaction = asyncHandler(async (req, res) => {
  console.log({"request param id ":req.params.id,"reqiest user id":req.user})
  const transaction = await TransactionModel.findById(req.params.id);
  if(transaction&&transaction.user.toString()===req.user.toString()){
    await TransactionModel.findByIdAndDelete(req.params.id);
    res.json({message:"Transaction deleted succefully"});
  }
});
